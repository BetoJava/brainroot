const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Détection de la plateforme
const platform = os.platform();
const YT_DLP_URL = platform === 'win32' 
  ? 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe'
  : 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp';

const YT_DLP_FILENAME = platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp';
const YT_DLP_PATH = path.join(__dirname, '..', 'bin', YT_DLP_FILENAME);

async function downloadYtDlp() {
  return new Promise((resolve, reject) => {
    // Créer le dossier bin s'il n'existe pas
    const binDir = path.dirname(YT_DLP_PATH);
    if (!fs.existsSync(binDir)) {
      fs.mkdirSync(binDir, { recursive: true });
    }

    const file = fs.createWriteStream(YT_DLP_PATH);
   
    https.get(YT_DLP_URL, (response) => {
      // Gérer les redirections
      if (response.statusCode === 302 || response.statusCode === 301) {
        https.get(response.headers.location, (redirectResponse) => {
          redirectResponse.pipe(file);
          handleFileEvents();
        }).on('error', reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Erreur lors du téléchargement: ${response.statusCode}`));
        return;
      }
     
      response.pipe(file);
      handleFileEvents();
    }).on('error', reject);

    function handleFileEvents() {
      file.on('finish', () => {
        file.close();
        // Rendre le fichier exécutable (important pour Linux/macOS)
        fs.chmodSync(YT_DLP_PATH, 0o755);
        console.log(`yt-dlp téléchargé avec succès pour ${platform}`);
        resolve();
      });
     
      file.on('error', (err) => {
        fs.unlink(YT_DLP_PATH, () => {}); // Supprimer le fichier partiel
        reject(err);
      });
    }
  });
}

async function main() {
  try {
    console.log(`Téléchargement de yt-dlp pour ${platform}...`);
    await downloadYtDlp();
    console.log('Installation terminée');
  } catch (error) {
    console.error('Erreur lors de l\'installation:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { downloadYtDlp };