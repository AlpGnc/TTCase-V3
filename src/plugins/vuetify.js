/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com
 */

// Styles
import "@mdi/font/css/materialdesignicons.css"; // Material Design iconları
import "vuetify/styles"; // Vuetify varsayılan stilleri
import "@/styles/app.sass"; // Özel stil dosyamızı dahil ediyoruz

// Composables
import { createVuetify } from "vuetify";

// Tema renklerini ve diğer ayarları burada tanımlıyoruz
export default createVuetify({
  theme: {
    defaultTheme: "dark",
    themes: {
      dark: {
        dark: true,
        colors: {
          background: "#090010", // Arka plan rengi
          surface: "#1A1A2E", // Kart ve yüzey rengi
          primary: "#160D1C", // Birincil renk
          secondary: "#03DAC5", // İkincil renk
          error: "#CF6679", // Hata rengi
          info: "#2196F3", // Bilgi rengi
          success: "#4CAF50", // Başarı rengi
          warning: "#FB8C00", // Uyarı rengi
        },
      },
    },
  },
});
