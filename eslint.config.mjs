import nextVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = [
    ...nextVitals,
    {
        ignores: ['.next/**', 'node_modules/**', 'public/vendor/**']
    }
];

export default eslintConfig;
