"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const path = require("path");
// Express modülünü ekliyoruz
const express = require("express");

async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    
    app.enableCors();

    // --- DÜZELTİLEN KISIM BURASI ---
    // __dirname = dist klasörü demektir.
    // '..' = Bir üst klasöre çık demektir (Ana dizine).
    // 'uploads' = Oradaki uploads klasörünü bul demektir.
    app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
    // -------------------------------

    await app.listen(process.env.PORT ?? 3333);
}
bootstrap();
//# sourceMappingURL=main.js.map