export default {
    "*.ts": [
        "prettier -c tooling-config/.prettierrc --ignore-path tooling-config/prettier-ignore --check src",
        "eslint -c .eslintrc.json --ignore-path tooling-config/eslint-ignore src/**/*.ts",
    ]
}