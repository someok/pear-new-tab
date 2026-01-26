/**
 * 解析字符串，分离首字符 emoji 和剩余字符串
 * @param {string} str - 要解析的字符串
 * @returns {{emoji: string, string: string}} 解析结果对象
 */
export function parseEmojiPrefix(str) {
    const result = { emoji: '', string: '' };

    if (!str || typeof str !== 'string') {
        return result;
    }

    const trimmedStr = str.trim();
    if (!trimmedStr) {
        return result;
    }

    // 使用展开运算符正确处理组合 emoji（如带肤色修饰符的 emoji）
    const chars = [...trimmedStr];
    const firstChar = chars[0];

    // 使用 Extended_Pictographic 匹配图形类 emoji，避免匹配数字等基础字符
    const emojiRegex = /\p{Extended_Pictographic}/u;

    if (emojiRegex.test(firstChar)) {
        result.emoji = firstChar;
        result.string = chars.slice(1).join('').trim();
    } else {
        result.string = trimmedStr;
    }

    return result;
}
