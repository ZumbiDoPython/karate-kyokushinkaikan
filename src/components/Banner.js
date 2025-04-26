import React from "react";

const Banner = () => (
  <div className="bg-black text-white flex flex-col md:flex-row justify-center items-center p-5 md:p-3 gap-4 md:gap-x-8 text-center">
    <img
      src="https://i.imgur.com/vF5SgMB.png"
      alt="Confederação Kyokushinkaikan"
      className="w-32 md:w-48 h-auto"
    />
    <div className="flex flex-col items-center">
      <div
        className="text-3xl md:text-title font-bold text-yellow-500 md:mb-7"
        style={{ fontFamily: "Kaushan Script, cursive" }}
      >
        ブラジル極真会館連盟
      </div>
      <div
        className="text-lg md:text-subtitle font-bold text-yellow-500"
        style={{ fontFamily: "Kaushan Script, cursive" }}
      >
        空手道 - キックボクシング - タイボクシング
      </div>
      <div className="text-sm md:info font-bold text-white mt-2 md:tracking-widest">
        ABERTO A TODOS OS ESTILOS DE KARATE FULL CONTACT - KICKBOXING - THAI BOXING
      </div>
      <div className="text-xs md:text-info2 font-bold text-yellow-500 md:tracking-widest md:mb-1">
        AV. DR. AFONSO VERGUEIRO 1503 - CENTRO - SOROCABA/SP
      </div>
      <div className="text-xs md:text-info3 font-bold text-yellow-500 md:tracking-widest">
        CEP. 18035-370 - FONE(15) 981287216 - E-mail: nagatajk@gmail.com
      </div>
    </div>
    <img
      src="https://i.imgur.com/DFNDU2D.png"
      alt="Kanji Kyokushin"
      className="w-20 md:w-24 h-auto"
    />
  </div>
);

export default Banner;
