export function formatCurrency(
   amount: number | bigint,
   MX = true,
   show_currency = true,
   fixed?: number, // nuevo parámetro opcional
) {
   let divisa = "MXN";
   let total: string;

   if (fixed !== undefined) {
      // Redondea a los decimales especificados
      total = Number(amount).toFixed(fixed);
      // Formatea miles
      const [intPart, decPart] = total.split(".");
      total =
         intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
         (decPart ? "." + decPart : "");
   } else {
      // Comportamiento anterior
      total = new Intl.NumberFormat(MX ? "es-MX" : "en-US").format(
         Number(amount),
      );
      if (!total.includes(".")) total += ".00";
      const decimales = total.split(".").reverse();
      if (decimales[0].length == 1) total += "0";
      if (amount == 0) total = "0.00";
   }

   if (show_currency) {
      total = `$${total} ${MX ? "MXN" : "USD"}`;
   } else {
      total = `$${total}`;
   }

   return total;
}

// export function formatCurrency(
//    amount: number | bigint,
//    MX = true,
//    show_currency = true,
// ) {
//    let divisa = "MXN";
//    let total = new Intl.NumberFormat("es-MX").format(amount);
//    if (!MX) {
//       divisa = "USD";
//       total = new Intl.NumberFormat("en-US").format(amount);
//    }

//    if (!total.includes(".")) total += ".00";
//    let decimales = total.split(".").reverse();
//    if (decimales[0].length == 1) total += "0";
//    if (amount == 0) total == "0.00";
//    show_currency ? (total = `$${total} ${divisa}`) : (total = `$${total}`);

//    return total;
// }
