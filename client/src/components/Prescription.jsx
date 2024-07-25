import React from "react";

export default function Prescription({ height, weight }) {
  const calculateBMI = (value1, value2) => {
    const weightInKg = value1;
    const heightInMeters = value2 / 100;
    const bmi = (weightInKg / Math.pow(heightInMeters, 2)).toFixed(2);

    const underweightRange = 18.5;
    const normalRange = 24.9;
    const overweightRange = 29.9;

    let bmiCategory = "";

    if (bmi < underweightRange) {
      bmiCategory = "Underweight";
    } else if (bmi <= normalRange) {
      bmiCategory = "Normal";
    } else if (bmi <= overweightRange) {
      bmiCategory = "Overweight";
    } else {
      bmiCategory = "Obese";
    }

    return bmiCategory;
  };

  const determinePhilippineSeason = () => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;

    if (currentMonth >= 3 && currentMonth <= 5) {
      return "hot";
    } else if (currentMonth >= 6 && currentMonth <= 11) {
      return "rain";
    } else if (currentMonth >= 12 || (currentMonth >= 1 && currentMonth <= 2)) {
      return "cool";
    } else {
      return "Season cannot be determined";
    }
  };
  const prescribeUsingSeason = () => {
    let recommendation = "";
    switch (determinePhilippineSeason()) {
      case "hot":
        recommendation =
          "Magsuot ng light at breathable na damit, uminom ng sapat na tubig para maiwasan ang dehydration. Palaging tiyakin na may proteksyon sa araw tulad ng sombrero o payong. Mahalagang malaman na 7:00 am - 9:00 am ang pinakaligtas na oras para mag-laro ang mga bata sa labas ngayong panahon ng tag-init.";
        break;
      case "rain":
        recommendation =
          "Siguruhing laging may payong o raincoat ang mga bata kapag sila ay lalabas. Huwag kalimutang magbigay ng mainit na inumin at makakain na nagbibigay lakas sa kanilang katawan. Maglaan din ng oras para sa pag-aalaga at bonding sa loob ng bahay, gaya ng pag-gawa ng masasarap na pagkain at inumin o kaya'y pag-kuwentuhan. Ang mainit na pagmamahal at atensiyon ay mahalaga para mapanatili ang kasiyahan ng mga bata kahit sa panahon ng ulan.";
        break;
      case "cool":
        recommendation =
          "Magsuot ng tamang kasuotan tulad ng jacket o sweater kapag malamig ang panahon lalo na kung hindi komportable sa lamig ang bata. Iwasan din ang paglanghap ng malamig na hangin nang diretso upang maiwasan ang sipon at ubo. Maari rin silang uminom ng mainit na sabaw o tsaa para mapanatili ang init sa kanilang katawan. Importante rin na hindi mawalan ng sapat na oras ng pagtulog upang mapanatili malakas na pangangatawan.";
        break;
      case "Season cannot be determined":
      default:
        break;
    }
    return recommendation;
  };

  const prescribeUsingBMI = () => {
    let recommendation = "";
    switch (calculateBMI(weight, height)) {
      case "Underweight":
        recommendation =
          "Dapat bigyan siya ng masustansiyang pagkain na mayaman sa protina, bitamina, at mineral. Isama sa kanyang pagkain ang mga prutas, gulay, whole grains, at mga pagkain na mayaman sa protina tulad ng isda, manok, at itlog. Regular na pumunta sa baranggay clinic para masubaybayan ang kanyang kalusugan at magbigay ng tamang rekomendasyon ng doctor.";
        break;
      case "Normal":
        recommendation =
          "Dapat siyang patuloy na kumain ng masustansiyang pagkain na naglalaman ng iba't ibang uri ng nutrisyon tulad ng prutas, gulay, whole grains, protina mula sa karne o isda, at gatas. Ang regular na ehersisyo ay importante rin para mapanatili ang kanyang kalusugan at kondisyon.";
        break;
      case "Overweight":
        recommendation =
          "Dapat bawasan ang pagkain ng mga processed foods, matamis na inumin, at mga pagkaing may mataas na taba. Sa halip, dapat bigyan ng emphasis ang pagkakaroon ng masustansiyang pagkain tulad ng prutas, gulay, whole grains, at protinang mula sa mga magaan na pagkain. Mahalaga rin na itaguyod ang regular na ehersisyo at aktibidad upang mapabuti ang metabolic rate at makatulong sa pagbawas ng timbang.";
        break;
      case "Obese":
        recommendation =
          "Dapat magfocus sa balanseng diet na binubuo ng prutas, gulay, at whole grains, habang bawasan naman ang pagkain ng mga processed foods, matamis na inumin, at mga pagkaing may mataas na calories. Dapat ding isama ang regular na ehersisyo o aktibidad sa araw-araw, na ayon sa kakayahan ng bata at ayon sa payo ng doktor. Mahalaga ring maunawaan na ang suporta ng pamilya at magulay makakatulong sa pagbabago ng lifestyle ng bata. Regular na i-monitor at ipacheck-up sa doktor upang masiguro ang ligtas at epektib ang proseso ng pagbawas ng timbang.";
        break;
      default:
        break;
    }
    return recommendation;
  };

  return (
    <>
      <li className="text-justify text-black">{prescribeUsingBMI()}</li>
      {/* <li>{prescribeUsingSeason()}</li> */}
    </>
  );
}
