import fs from 'fs'

const exportDate = (data) => {
    const filePath = "./PharmaSee_Backend/src/data";

    fs.writeFile(filePath, data, (err) => {
    if (err) {
        console.error("Error writing to file:", err);
    } else {
        console.log(`File has been created at: ${filePath}`);
    }
    })
};
export default exportDate