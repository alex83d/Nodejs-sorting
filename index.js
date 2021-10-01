const fs = require('fs');
const path = require('path');

// eslint-disable-next-line prefer-const
let [, , inputDir, outputDir = './dist/', isDel = 'yes'] = process.argv;

if (!inputDir || !outputDir) {
  // eslint-disable-next-line no-console
  console.error('Не задана исходная директория!');
  process.exit(1);
} else if (inputDir === outputDir) {
  // eslint-disable-next-line no-console
  console.error('Директории совпадают!');
  process.exit(1);
} else {
  inputDir = path.join(__dirname, inputDir);
  outputDir = path.join(__dirname, outputDir);
}

if (!fs.existsSync(outputDir) && fs.mkdirSync(outputDir, { recursive: true })) {
  // eslint-disable-next-line no-use-before-define
  sortDir();
} else {
  // eslint-disable-next-line no-console
  console.info('Директория уже существует!');
  process.exit(1);
}

function sortDir() {
  let count = 0;

  const countFiles = (dir) => {
    fs.readdirSync(dir).forEach((item) => {
      const localDir = path.join(dir, item);
      const state = fs.statSync(localDir);
      if (state.isDirectory()) {
        countFiles(localDir);
        // console.log(localDir)
      } else {
        count += 1;
      }
    });
  };

  const readDir = (dir) => {
    try {
      const files = fs.readdirSync(dir);

      files.forEach((item) => {
        const stats = fs.statSync(path.join(dir, item));
        if (stats.isDirectory()) {
          readDir(path.join(dir, item));
        } else {
          const newDir = path.join(outputDir, item.substr(0, 1).toUpperCase());

          if (!fs.existsSync(newDir)) {
            fs.mkdirSync(newDir);
          }

          fs.copyFileSync(path.join(dir, item), path.join(newDir, item));
          count -= 1;

          if (isDel === 'yes' && count === 0) {
            // eslint-disable-next-line no-console
            console.info('Удаление исходной директории!');
            fs.rmdirSync(inputDir, {
              recursive: true,
            });
          }
        }
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      process.exit(1);
    }
  };

  // eslint-disable-next-line no-unused-expressions
  isDel && countFiles(inputDir);
  readDir(inputDir);
}
