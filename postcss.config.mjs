/** @type {import('postcss-load-config').Config} */
// I'm not sure whether this needs to be added to allow tailwind CSS to work
const config = {
    plugins: {
      tailwindcss: {},
    },
  };
  
  export default config;