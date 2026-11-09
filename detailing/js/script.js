const panels=[...document.querySelectorAll('.panel')], steps=[...document.querySelectorAll('.step')];
let current=0, selectedDate=null, viewDate=new Date(); viewDate.setDate(1);
const $=id=>document.getElementById(id);
const money=n=>new Intl.NumberFormat('fa-IR').format(n)+' تومان';
function showPanel(n){current=n;panels.forEach((p,i)=>p.classList.toggle('current',i===n));steps.forEach((s,i)=>{s.classList.toggle('active',i===n);s.classList.toggle('done',i<n)});if(n===2)renderCalendar();if(n===3)fillSummary();document.querySelector('#steps').scrollIntoView({behavior:'smooth',block:'center'});}
function validatePanel(){if(current===0){if(!document.querySelector('input[name="service"]:checked')){alert('لطفاً حداقل یک خدمت انتخاب کن.');return false;}}if(current===1){for(const id of ['brand','model','color','customer','phone']){if(!$(id).checkValidity()){$(id).reportValidity();return false;}}}if(current===2&&!selectedDate){alert('لطفاً یک روز قابل رزرو انتخاب کن.');return false;}return true;}
document.querySelectorAll('[data-next]').forEach(b=>b.addEventListener('click',()=>{if(validatePanel())showPanel(Math.min(3,current+1))}));
document.querySelectorAll('[data-prev]').forEach(b=>b.addEventListener('click',()=>showPanel(Math.max(0,current-1))));

// Demo capacity data. Replace this list with dates returned by your booking API.
const fullDates=new Set(['2026-11-10','2026-11-13','2026-11-17','2026-11-21','2026-11-25','2026-12-02','2026-12-06','2026-12-12']);
const monthNames=['ژانویه','فوریه','مارس','آوریل','مه','ژوئن','ژوئیه','اوت','سپتامبر','اکتبر','نوامبر','دسامبر'];
function pad(n){return String(n).padStart(2,'0')}
function iso(y,m,d){return `${y}-${pad(m+1)}-${pad(d)}`}
function renderCalendar(){
 const y=viewDate.getFullYear(),m=viewDate.getMonth();$('monthTitle').textContent=`${monthNames[m]} ${new Intl.NumberFormat('fa-IR').format(y)}`;
 const first=new Date(y,m,1), count=new Date(y,m+1,0).getDate();let offset=(first.getDay()+1)%7; // Saturday-first
 const wrap=$('calendarDays');wrap.innerHTML='';
 for(let i=0;i<offset;i++){const s=document.createElement('span');wrap.appendChild(s)}
 const today=new Date();today.setHours(0,0,0,0);
 for(let d=1;d<=count;d++){const date=new Date(y,m,d),key=iso(y,m,d),btn=document.createElement('button');btn.type='button';btn.textContent=new Intl.NumberFormat('fa-IR').format(d);const isPast=date<today,full=fullDates.has(key);btn.disabled=isPast||full; if(full)btn.title='ظرفیت این روز تکمیل شده';if(key===iso(today.getFullYear(),today.getMonth(),today.getDate()))btn.classList.add('today');if(selectedDate===key)btn.classList.add('selected');btn.addEventListener('click',()=>{selectedDate=key;renderCalendar();$('selectedDate').textContent=new Intl.DateTimeFormat('fa-IR',{dateStyle:'full'}).format(date)});wrap.appendChild(btn)}
}
$('prevMonth').addEventListener('click',()=>{const now=new Date();const candidate=new Date(viewDate.getFullYear(),viewDate.getMonth()-1,1);if(candidate.getFullYear()>now.getFullYear()||(candidate.getFullYear()===now.getFullYear()&&candidate.getMonth()>=now.getMonth())){viewDate=candidate;renderCalendar()}});
$('nextMonth').addEventListener('click',()=>{viewDate=new Date(viewDate.getFullYear(),viewDate.getMonth()+1,1);renderCalendar()});
function fillSummary(){
 const chosen=[...document.querySelectorAll('input[name="service"]:checked')];const total=chosen.reduce((s,x)=>s+Number(x.dataset.price),0);
 $('sumServices').textContent=chosen.map(x=>x.value).join('، ');$('sumCar').textContent=$('brand').value+' '+$('model').value;$('sumColor').textContent=$('color').value;
 const [y,m,d]=selectedDate.split('-').map(Number);$('sumDate').textContent=new Intl.DateTimeFormat('fa-IR',{dateStyle:'full'}).format(new Date(y,m-1,d));$('sumCustomer').textContent=$('customer').value;$('sumPhone').textContent=$('phone').value;
 $('totalPrice').textContent=money(total);$('depositPrice').textContent=money(Math.round(total*.2));
}
$('bookingForm').addEventListener('submit',e=>{e.preventDefault();if(!validatePanel())return; // Demo only: replace with server-side order creation + payment gateway redirect.
 $('bookingForm').hidden=true;$('steps').hidden=true;document.querySelector('.section-heading').hidden=true;$('successBox').hidden=false;});
