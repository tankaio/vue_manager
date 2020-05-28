export function ymdAndHms(timeStamp) {
  const dt = new Date(timeStamp);
  let y = dt.getFullYear();
  let m = (dt.getMonth() + 1 + "").padStart(2, "0");
  let d = (dt.getDate() + "").padStart(2, "0");
  let hh = (dt.getHours() + "").padStart(2, "0");
  let mm = (dt.getMinutes() + "").padStart(2, "0");
  let ss = (dt.getSeconds() + "").padStart(2, "0");
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
}
