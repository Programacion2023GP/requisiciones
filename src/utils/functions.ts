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
export const waitAndClick = async (
   selector: string,
   timeout = 3000,
): Promise<boolean> => {
   const waitForElement = (
      selector: string,
      timeout = 3000,
   ): Promise<HTMLElement | null> => {
      return new Promise((resolve) => {
         const interval = setInterval(() => {
            const el = document.querySelector(selector) as HTMLElement | null;
            if (el) {
               clearInterval(interval);
               resolve(el);
            }
         }, 100);
         setTimeout(() => {
            clearInterval(interval);
            resolve(null);
         }, timeout);
      });
   };

   const el = await waitForElement(selector, timeout);

   if (el) {
      console.log(`✅ Click en: ${selector}`);
      const clickEvent = new MouseEvent("click", {
         bubbles: true,
         cancelable: true,
      });
      el.dispatchEvent(clickEvent); // mejor que el.click()
      return true;
   } else {
      console.warn(`⚠️ Elemento no encontrado: ${selector}`);
      return false;
   }
};

export function formatDatetimeToSQL(the_date, dbType = "mysql") {
   const date = new Date(the_date);
   const pad = (n) => String(n).padStart(2, "0");

   const formatted = {
      mysql: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`,
      sqlserver: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`,
   };

   if (dbType !== "mysql" && dbType !== "sqlserver") {
      console.warn(
         `Tipo de base de datos desconocido "${dbType}", usando formato MySQL por defecto.`,
      );
   }

   return formatted[dbType] || formatted.mysql;
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
