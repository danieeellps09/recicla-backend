import { Injectable, InternalServerErrorException } from '@nestjs/common';
import puppeteer from 'puppeteer';

@Injectable()
export class PdfService {

    async generatePdfExemple(): Promise<Buffer> {

        try {
            const browser = await puppeteer.launch({ headless: "new" });
            const page = await browser.newPage();

            await page.setContent(`
        <html>
          <head>
            <style>
              body {
                font-size: 18px;
                color: #333;
              }
              body p{
                text-align: right;
              }
            </style>
          </head>
          <body>
            <h1>Meu PDF com Nest.js e CSS</h1>
            <p>Este é um exemplo de como aplicar estilos CSS a um PDF.</p>
          </body>
        </html>
      `);

            const pdfBuffer = await page.pdf({ format: 'A4' });
            await browser.close();

            return pdfBuffer;
        }
        catch(error){
            throw new InternalServerErrorException("Ocorreu um erro ao gerar PDF.")
        }
        
    }
}
