export default {
    "*.ts": [
        "prettier -c tooling-config/.prettierrc --ignore-path tooling-config/prettier-ignore --check src",
        "eslint -c tooling-config/.eslintrc.js --ignore-path tooling-config/eslint-ignore src/**/*.ts",
    ]
}