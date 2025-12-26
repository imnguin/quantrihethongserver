import fs from 'fs'
import crypto from 'crypto'

export const generateKey = () => {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem'
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem'
        }
    });

    const path = "D:/Server/keyrsa/";

    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
    fs.writeFileSync(path + 'publicKey.pem', publicKey);
    fs.writeFileSync(path + 'privateKey.pem', privateKey);

    // Đọc tệp PEM
    const publicKeyPEM = fs.readFileSync('D:/Server/keyrsa/publicKey.pem', 'utf8');

    // Chuyển đổi PEM thành đối tượng khóa công khai
    const publicKeyaaaa = crypto.createPublicKey({
      key: publicKeyPEM,
      format: 'pem'
    });

    // Dữ liệu bạn muốn ký số
    const dataToSign = 'Hello, digital signature!';

    // Tạo chữ ký số bằng khóa riêng
    const sign = crypto.sign('sha256', Buffer.from(dataToSign, 'utf8'), {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
      saltLength: 32,
    });
    // Xác minh chữ ký số bằng khóa công khai
    const isVerified = crypto.verify(
      'sha256',
      Buffer.from(dataToSign, 'utf8'),
      publicKeyPEM,
      sign,
      crypto.constants.RSA_PKCS1_PSS_PADDING,
      32
    );
}