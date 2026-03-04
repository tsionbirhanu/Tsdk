export interface TrendRow {
    m: string; total: number; aserat: number; selet: number; gbir: number;
  }
  export interface PieItem  { name: string; value: number; color: string; }
  export interface Campaign { id: number; title: string; goal: number; raised: number; members: number; status: string; ends: string; }
  export interface User      { id: number; name: string; email: string; role: string; joined: string; total: string; status: string; }
  export interface Transaction { id: number; user: string; type: string; amount: string; date: string; status: string; }
  export interface ScheduleItem { day: string; time: string; platform: string; type: string; content: string; }
  export interface Report { title: string; size: string; type: string; date: string; color: string; }
export interface Church { id: number; name: string; address?: string; phone?: string; email?: string; password?: string; }
export interface Member { id: number; churchId: number; name: string; email?: string; role?: string; joined?: string }
  
  export const trends: TrendRow[] = [
    { m:"Jan", total:42000, aserat:18000, selet:12000, gbir:12000 },
    { m:"Feb", total:38000, aserat:16000, selet:10000, gbir:12000 },
    { m:"Mar", total:55000, aserat:22000, selet:15000, gbir:18000 },
    { m:"Apr", total:49000, aserat:20000, selet:14000, gbir:15000 },
    { m:"May", total:63000, aserat:26000, selet:18000, gbir:19000 },
    { m:"Jun", total:71000, aserat:30000, selet:20000, gbir:21000 },
    { m:"Jul", total:58000, aserat:24000, selet:16000, gbir:18000 },
    { m:"Aug", total:67000, aserat:28000, selet:19000, gbir:20000 },
    { m:"Sep", total:74000, aserat:31000, selet:21000, gbir:22000 },
    { m:"Oct", total:82000, aserat:34000, selet:24000, gbir:24000 },
    { m:"Nov", total:79000, aserat:33000, selet:22000, gbir:24000 },
    { m:"Dec", total:94000, aserat:40000, selet:27000, gbir:27000 },
  ];
  
  export const pieD: PieItem[] = [
    { name:"Aserat",   value:322000, color:"#c8921a" },
    { name:"Selet",    value:198000, color:"#8b3a3a" },
    { name:"Gbir",     value:212000, color:"#3a6e4a" },
    { name:"Campaign", value:141000, color:"#5a4a8a" },
  ];
  
  export const initCamps: Campaign[] = [
    { id:1, title:"Church Roof Repair",         goal:500000, raised:347200, members:142, status:"Active",    ends:"Mar 15, 2025" },
    { id:2, title:"Sunday School Expansion",    goal:200000, raised:189000, members:87,  status:"Active",    ends:"Feb 28, 2025" },
    { id:3, title:"Christmas Celebration Fund", goal:150000, raised:150000, members:210, status:"Completed", ends:"Jan 7, 2025"  },
    { id:4, title:"New Altar Equipment",        goal:300000, raised:62000,  members:34,  status:"Paused",    ends:"Apr 30, 2025" },
    { id:5, title:"Youth Ministry Trip",        goal:80000,  raised:15000,  members:19,  status:"Active",    ends:"May 20, 2025" },
  ];
  
  export const initUsers: User[] = [
    { id:1, name:"Abebe Kebede",   email:"abebe@example.com",  role:"Member", joined:"Jan 2019", total:"ETB 45,200",  status:"Active"   },
    { id:2, name:"Tigist Haile",   email:"tigist@example.com", role:"Deacon", joined:"Mar 2018", total:"ETB 92,400",  status:"Active"   },
    { id:3, name:"Mekdes Alemu",   email:"mekdes@example.com", role:"Member", joined:"Jun 2021", total:"ETB 18,700",  status:"Active"   },
    { id:4, name:"Dawit Tesfaye",  email:"dawit@example.com",  role:"Admin",  joined:"Sep 2017", total:"ETB 131,500", status:"Active"   },
    { id:5, name:"Hiwot Girma",    email:"hiwot@example.com",  role:"Member", joined:"Nov 2022", total:"ETB 8,900",   status:"Inactive" },
    { id:6, name:"Biruk Mengistu", email:"biruk@example.com",  role:"Member", joined:"Feb 2023", total:"ETB 5,200",   status:"Active"   },
  ];
  
  export const initChurches: Church[] = [
    { id:1, name:"St. Gabriel Church", address:"Addis Ababa", phone:"+251911000000", email:"info@stgabriel.org", password:"secret1" },
    { id:2, name:"Holy Trinity Church", address:"Bole, Addis Ababa", phone:"+251911111111", email:"contact@holytrinity.org", password:"secret2" },
  ];

  // members are stored separately to keep Church shape lightweight for other views
  export const initChurchMembers: Member[] = [
    { id: 1, churchId: 1, name: "Abebe Kebede", email: "abebe@example.com", role: "Member", joined: "Jan 2019" },
    { id: 2, churchId: 1, name: "Tigist Haile", email: "tigist@example.com", role: "Deacon", joined: "Mar 2018" },
    { id: 3, churchId: 2, name: "Mekdes Alemu", email: "mekdes@example.com", role: "Member", joined: "Jun 2021" },
  ];
  
  export const txData: Transaction[] = [
    { id:1, user:"Abebe Kebede",   type:"Aserat",   amount:"ETB 3,000",  date:"Dec 15", status:"Completed" },
    { id:2, user:"Tigist Haile",   type:"Campaign", amount:"ETB 10,000", date:"Dec 14", status:"Completed" },
    { id:3, user:"Mekdes Alemu",   type:"Selet",    amount:"ETB 2,500",  date:"Dec 13", status:"Pending"   },
    { id:4, user:"Biruk Mengistu", type:"Gbir",     amount:"ETB 1,000",  date:"Dec 12", status:"Completed" },
    { id:5, user:"Hiwot Girma",    type:"Aserat",   amount:"ETB 3,000",  date:"Dec 11", status:"Failed"    },
  ];
  
  export const captions: string[] = [
    "🕊️ In giving, we reflect the generosity of God. Your Aserat offering blesses our entire congregation. #EthiopianOrthodox #Tewahedo",
    "✝️  ለሁሉም ክፍት ናት። ዛሬ ለ ድጋፍ ይስጡ። #አርቶዶክስ #ጸሎት",
    "🌟 Every Selet fulfilled is a covenant honored. Thank you to our faithful members who stand with our church.",
    "🔔 Sunday service begins at 6:00 AM. Come, worship, and be renewed. All are welcome in the house of the Lord.",
    "📿 Our Christmas Campaign needs your support. Make this Gena celebration unforgettable for our community.",
    "⛪  የጋራ ቤት ነው። ዛሬ ለ ህንፃ ጥገና ፕሮጀክት ድጋፍ ስጡ።",
  ];
  
  export const schedule: ScheduleItem[] = [
    { day:"Monday",    time:"7:00 AM",  platform:"Telegram", type:"Devotional",  content:"Morning prayer verse with church photo"           },
    { day:"Tuesday",   time:"6:00 PM",  platform:"Facebook", type:"Campaign",    content:"Progress update on Roof Repair campaign"          },
    { day:"Wednesday", time:"8:00 AM",  platform:"Telegram", type:"Reminder",    content:"Mid-week fasting reminder (Quidam)"               },
    { day:"Thursday",  time:"12:00 PM", platform:"Facebook", type:"Testimonial", content:"Member giving testimony spotlight"                },
    { day:"Friday",    time:"5:00 PM",  platform:"Telegram", type:"Reminder",    content:"Weekend service time reminder"                    },
    { day:"Saturday",  time:"10:00 AM", platform:"Facebook", type:"Event",       content:"Upcoming Sunday school announcement"              },
    { day:"Sunday",    time:"5:30 AM",  platform:"Both",     type:"Worship",     content:"Live service notification + stream link"          },
  ];
  
  export const reports: Report[] = [
    { title:"Annual Report 2024",     size:"2.4 MB", type:"PDF",  date:"Jan 1, 2025",  color:"#c8921a" },
    { title:"Q4 Giving Summary",      size:"1.1 MB", type:"PDF",  date:"Dec 31, 2024", color:"#3a6e4a" },
    { title:"Q3 Giving Summary",      size:"1.0 MB", type:"PDF",  date:"Sep 30, 2024", color:"#3a6e4a" },
    { title:"Aserat Report Nov 2024", size:"420 KB", type:"CSV",  date:"Nov 30, 2024", color:"#8b3a3a" },
    { title:"Campaign Analysis",      size:"780 KB", type:"PDF",  date:"Dec 15, 2024", color:"#5a4a8a" },
    { title:"Member Giving 2024",     size:"1.8 MB", type:"XLSX", date:"Dec 31, 2024", color:"#1e4e7a" },
  ];