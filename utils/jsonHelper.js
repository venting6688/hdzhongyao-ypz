import { jsonrepair } from 'jsonrepair'
export function safeParseJSON(input) {
  // ✅ 已经是对象或数组，递归解析内部
  if (typeof input === 'object' && input !== null) {
    Object.keys(input).forEach(key => {
      input[key] = safeParseJSON(input[key])
    })
    return input
  }

  // ✅ 非字符串直接返回
  if (typeof input !== 'string') return input

  const s = input.trim()
  if (!s) return s

  // ⚙️ 如果是流式半截 JSON（例如 content 正在拼接中），直接返回字符串
  // 例如： {"intent": "A999", "content": "我 是个 AI
  if (s.includes('"content": "') && !/["\]}]$/.test(s)) {
    // 🚫 不完整，不解析，直接返回
    return s
  }

  // 🚦 判断是否看起来是完整 JSON
  const looksLikeJSON = /^[\[{"]/.test(s) && /[\]}"]$/.test(s)
  if (!looksLikeJSON) {
    // 🚫 明显不是JSON（纯文本等），直接返回
    return s
  }

  // ✅ 尝试解析 + 修复
  try {
    return deepParse(s)
  } catch {
    try {
      const repaired = jsonrepair(s)
      return deepParse(repaired)
    } catch {
      // ❌ 实在不是 JSON，返回原始字符串
      return s
    }
  }
}

/**
 * 深层解析 JSON 字符串（递归）
 */
function deepParse(str) {
  if (!(str.startsWith('{') || str.startsWith('[') || str.startsWith('"'))) {
    return str
  }

  let result
  try {
    result = JSON.parse(str)
  } catch {
    const repaired = jsonrepair(str)
    result = JSON.parse(repaired)
  }

  // ✅ 如果结果是对象或数组，递归解析子项
  if (typeof result === 'object' && result !== null) {
    for (const key in result) {
      result[key] = safeParseJSON(result[key])
    }
  }

  return result
}
