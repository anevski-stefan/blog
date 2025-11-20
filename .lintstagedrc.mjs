import path from "path"

const buildEslintCommand = filenames =>
  `eslint --fix ${filenames
    .map(f => `"${path.relative(process.cwd(), f)}"`)
    .join(" ")}`

const buildPrettierCommand = filenames =>
  `prettier --write ${filenames
    .map(f => `"${path.relative(process.cwd(), f)}"`)
    .join(" ")}`

const config = {
  "*.{js,jsx,ts,tsx}": [buildEslintCommand, buildPrettierCommand],
  "*.{json,md,mdx,css,html,yml,yaml,scss}": [buildPrettierCommand],
}

export default config
