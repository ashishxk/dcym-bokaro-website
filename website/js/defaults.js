/* Sample content shown until real content is added (via the admin website or data/site-data.js). */
window.DCYM_DEFAULT={
 contact:{email:"parish-email@example.org",phone:"",address:"",whatsapp:"",social:{Facebook:"",Instagram:"",YouTube:""}},
 about:{who:"We are young people of the parish who meet to worship, learn, support one another, and serve our neighbours.",values:"Faith, unity, compassion, responsibility, and friendship.",mission:"To help young people grow closer to God and take an active part in the life and service of the Church.",vision:"A united, welcoming youth community that shows Christ’s love in the parish and beyond."},
 leaders:["Parish Priest / Spiritual Director","President","Vice-President","Secretary","Joint Secretary","Treasurer","Executive Committee Member"].map(role=>({role,name:"",desc:"",photo:""})),
 activities:[["Holy Mass and worship","Gathering for the Church’s worship and sacraments."],["Prayer meetings","Time set apart for shared prayer."],["Youth fellowship","Regular meetings to build friendships and faith."],["Bible study","Reading and discussing Scripture together."],["Retreats and spiritual formation","Days away for reflection and renewal."],["Choir and music","Leading the congregation in song."],["Charity and social service","Practical help for those in need."],["Community outreach","Reaching out to neighbours and families."],["Cultural programmes","Celebrating faith through arts and culture."],["Youth conventions","Joining young people from across the diocese."]].map(a=>({title:a[0],desc:a[1]})),
 events:["Youth fellowship gathering","Prayer and Bible study evening","Community service day","Youth retreat"].map(title=>({title,date:"",time:"",venue:"",desc:"A sample description of what happens at this event.",reg:"",photo:""})),
 gallery:[["Parish celebrations","Parish celebration"],["Youth gatherings","Youth gathering"],["Retreats","Retreat"],["Church festivals","Church festival"],["Charity activities","Charity activity"],["Group photographs","Group photograph"]].map(g=>({cat:g[0],caption:g[1],photo:""})),
 notices:[["Parish announcement","Short summary of the announcement goes here."],["Meeting schedule","Short summary of the next meeting goes here."],["Registration notice","Short summary of the registration details goes here."]].map(n=>({title:n[0],date:"",summary:n[1],body:""})),
 verseDays:[],
 saved:false
};
