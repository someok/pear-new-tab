import { proxy, subscribe, useSnapshot } from 'valtio';

/**
 * @typedef {'light' | 'dark' | 'system'} ThemeMode
 */

/**
 * @typedef {object} ThemeState
 * @property {ThemeMode} mode - 当前选中的模式
 * @property {boolean} isDark - 当前实际渲染是否为深色（计算值）
 */

// --- 1. 内部逻辑：获取初始状态 ---

const THEME_KEY = 'app-theme-mode';

/**
 * 异步获取初始主题模式
 * @return {Promise<ThemeMode>}
 */
async function getInitialMode() {
    if (typeof chrome === 'undefined' || !chrome.storage) {
        return 'system';
    }

    const result = await chrome.storage.local.get([THEME_KEY]);
    return result[THEME_KEY] || 'system';
}

// --- 2. Store 定义 ---

/**
 * Valtio 状态代理
 * @type {ThemeState}
 */
const state = proxy({
    mode: 'system',
    isDark: false,
});

// 异步初始化 mode
getInitialMode().then((mode) => {
    state.mode = mode;
});

// --- 3. Actions (修改状态的方法) ---

const actions = {
    /**
     * 设置主题模式
     * @param {ThemeMode} mode
     */
    setMode: (mode) => {
        state.mode = mode;
    },

    /**
     * 切换明暗模式 (仅在非 System 模式下建议使用)
     */
    toggleMode: () => {
        state.mode = state.mode === 'dark' ? 'light' : 'dark';
    },
};

// --- 4. 核心副作用：同步 DOM 和 LocalStorage ---

function syncTheme() {
    if (typeof window === 'undefined')
        return;

    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // 计算当前是否应该是黑夜
    let nextIsDark;
    if (state.mode === 'system') {
        nextIsDark = mediaQuery.matches;
    } else {
        nextIsDark = state.mode === 'dark';
    }

    // 1. 更新 Store 中的计算属性 (isDark)
    if (state.isDark !== nextIsDark) {
        state.isDark = nextIsDark;
    }

    // 2. 操作 DOM (Tailwind v4 需要 class="dark")
    if (nextIsDark) {
        root.classList.add('dark');
        root.style.colorScheme = 'dark';
    } else {
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
    }

    // 3. 持久化存储
    if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.set({ [THEME_KEY]: state.mode });
    }
}

// 订阅 Store 变化
subscribe(state, syncTheme);

// 监听系统原生主题变化
if (typeof window !== 'undefined') {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', () => {
        // 只有在 system 模式下，系统变化才需要触发同步
        if (state.mode === 'system')
            syncTheme();
    });

    // 初始化执行一次
    syncTheme();
}

// --- 5. 导出 Hook ---

/**
 * 自定义主题 Hook
 *
 * @return {{
 *   mode: ThemeMode,
 *   isDark: boolean,
 *   setMode: (mode: ThemeMode) => void,
 *   toggleMode: () => void
 * }}
 */
export function useTheme() {
    const snap = useSnapshot(state);

    return {
        mode: snap.mode,
        isDark: snap.isDark,
        setMode: actions.setMode,
        toggleMode: actions.toggleMode,
    };
}
