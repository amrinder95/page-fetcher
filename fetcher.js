const fs = require('fs'); //fs package
const request = require('request'); //request package
const readline = require('readline'); //readline package
const { stdin: input, stdout: output } = require('process');
const rl = readline.createInterface({ input, output });
const arg = process.argv.slice(2) // command line input

const fetcher = (arg) => {
  if (arg[1].includes ("./")) { //edgecase 2
  request(arg[0], (error, response, body) => { //edge case 3
    let code = response.statusCode;
    if (code < 200 || code > 299){
      console.log("URL invalid.")
      process.exit();
    }
    fs.access(arg[1], fs.constants.F_OK, (err) => { //edge case 1
      const exists = err ? 'File does not exist' : 'File exists';
      console.log(exists);
      if (exists !== 'File exists') {
        fs.writeFile(arg[1], body, err => { //write the body of the webpage to inputted file path
          if (err) {
            console.error(err);
          } else {
            console.log('File written successfully.')
            process.exit();
          }
        });
      } else {
        rl.question('Do you want to overwrite the file? Y or N \n', (answer) => { //edge case 1
          if (answer === 'Y') {
            fs.writeFile(arg[1], body, err => {
              if (err) {
                console.error(err);
              } else {
                console.log('File written successfully.')
                rl.close();
              }
            });
          } else {
            console.log("File did not write successfully.")
            rl.close();
          }
        })
      }
    });
  });
} else {
  console.log("Not a valid file path.") 
  process.exit();
}
};

fetcher(arg);