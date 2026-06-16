/**
 * Formata um bloco do PIX no padrão EMVCo (ID + Tamanho + Valor)
 */
const formatPixField = (id, value) => {
    const stringValue = String(value);
    const length = stringValue.length.toString().padStart(2, '0');
    return `${id}${length}${stringValue}`;
};

/**
 * Calcula o Checksum CRC16-CCITT exigido pelo Banco Central
 */
const crc16 = (payload) => {
    let crc = 0xFFFF;
    for (let i = 0; i < payload.length; i++) {
        crc ^= payload.charCodeAt(i) << 8;
        for (let j = 0; j < 8; j++) {
            if ((crc & 0x8000) !== 0) {
                crc = (crc << 1) ^ 0x1021;
            } else {
                crc = crc << 1;
            }
        }
    }
    return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
};

/**
 * Gera a string "PIX Copia e Cola" oficial
 */
export const generatePixPayload = ({ pixKey, merchantName, merchantCity, txid = '***' }) => {
    // Sanitização básica
    const cleanKey = pixKey.trim();
    const cleanName = merchantName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").substring(0, 25).trim();
    const cleanCity = merchantCity.normalize("NFD").replace(/[\u0300-\u036f]/g, "").substring(0, 15).trim();

    // Montagem dos blocos
    const gui = formatPixField('00', 'BR.GOV.BCB.PIX');
    const key = formatPixField('01', cleanKey);
    const merchantAccount = formatPixField('26', gui + key);
    const additionalData = formatPixField('62', formatPixField('05', txid));

    // String base sem o CRC
    const payloadBase = 
        formatPixField('00', '01') +           // Payload Format Indicator
        merchantAccount +                      // Informações da Conta
        formatPixField('52', '0000') +         // Merchant Category Code (0000 = não especificado)
        formatPixField('53', '986') +          // Moeda (986 = BRL)
        formatPixField('58', 'BR') +           // País
        formatPixField('59', cleanName) +      // Nome do Recebedor
        formatPixField('60', cleanCity) +      // Cidade do Recebedor
        additionalData +                       // TXID
        '6304';                                // Prefixo do CRC16

    // Retorna a string final com o Checksum calculado
    return payloadBase + crc16(payloadBase);
};