module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true
  },
  extends: ['plugin:vue/essential', 'eslint:recommended'],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    // ✅ 修复该规则
    // 推荐：放在项目根 .eslintrc.js 的 rules 中（直接复制替换原条目）
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: 3,
        multiline: 1
      }
    ],

    // 其他常见规则放宽：
    'vue/singleline-html-element-content-newline': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    'vue/html-self-closing': 'off',
    'no-console': 'off'
  }
}
