import { motion } from "framer-motion";
import { MapPin, Hospital, Stethoscope, Phone, CircleAlert } from "lucide-react";
import PageHeader from "../PageHeader/PageHeader.jsx";
import "./DiagnosisTreatment.css";


const fadeUp = {
  hidden:{
    opacity:0,
    y:18,
  },
  show:{
    opacity:1,
    y:0,
    transition:{
      duration:.6,
      ease:[0.16,1,0.3,1],
    },
  },
};


const locations = [
  {
    city:"Nairobi",
    icon:Hospital,
    facilities:[
      "Major referral hospitals with neurology services",
      "Neurologists experienced in peripheral nerve disorders",
      "Physiotherapy and rehabilitation support",
    ],
  },

  {
    city:"Mombasa",
    icon:MapPin,
    facilities:[
      "Regional hospitals providing specialist referrals",
      "Neurology assessment through specialist clinics",
      "Rehabilitation and physiotherapy services",
    ],
  },

  {
    city:"Kisumu",
    icon:MapPin,
    facilities:[
      "Regional referral care",
      "Neurological assessment and referral pathways",
      "Rehabilitation support services",
    ],
  },
];


export default function DiagnosisTreatment(){

return(
<>


<PageHeader

eyebrow="Support Resources"

title="Where to Get Diagnosed and Treated in Kenya"

subtitle="Information to help patients and families find neurological care, specialist assessment, and rehabilitation support for GBS, CIDP, and MMN."

/>



<motion.section

className="section"

initial="hidden"

whileInView="show"

viewport={{once:true,amount:.2}}

variants={fadeUp}

>

<div className="container">


<div className="diagnosis-intro card">


<Stethoscope size={42}/>


<h2>
Finding the right medical support
</h2>


<p>
GBS, CIDP, and MMN require assessment by healthcare professionals
with experience in neurological conditions. Diagnosis usually involves
a clinical examination, nerve tests, blood tests, and specialist review.
</p>


</div>


</div>


</motion.section>





<section className="section diagnosis-locations">

<div className="container">


<div className="section-head">

<p className="eyebrow">
Healthcare Access
</p>

<h2>
Care locations in Kenya
</h2>

</div>




<div className="diagnosis-grid">


{locations.map((location,index)=>{

const Icon = location.icon;


return(

<motion.article

key={location.city}

className="diagnosis-card"

initial={{
opacity:0,
y:20
}}

whileInView={{
opacity:1,
y:0
}}

viewport={{once:true}}

transition={{
duration:.5,
delay:index*.1
}}

>


<div className="diagnosis-icon">

<Icon size={32}/>

</div>


<h3>
{location.city}
</h3>


<ul>

{location.facilities.map(item=>(

<li key={item}>
{item}
</li>

))}

</ul>


</motion.article>

)

})}


</div>


</div>

</section>






<section className="section diagnosis-warning">

<div className="container">


<div className="diagnosis-warning__card">


<CircleAlert size={36}/>


<div>

<h2>
When to seek urgent care
</h2>


<p>
Sudden weakness, rapidly worsening symptoms, difficulty breathing,
difficulty swallowing, or inability to walk require urgent medical
attention.
</p>


</div>


</div>


</div>

</section>



</>

)

}