import { motion } from "framer-motion";
import {
  Accessibility,
  Dumbbell,
  Activity,
  HeartPulse,
  MapPin,
} from "lucide-react";

import PageHeader from "../PageHeader/PageHeader.jsx";
import "./Rehabilitation.css";


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


const services = [

{
  title:"Neurological Physiotherapy",
  icon:Accessibility,
  description:
  "Specialised physiotherapy focused on improving movement, strength, balance, coordination, and independence."
},


{
  title:"Strength & Mobility Training",
  icon:Dumbbell,
  description:
  "Guided exercises help rebuild muscle strength, improve endurance, and support safe daily activities."
},


{
  title:"Functional Rehabilitation",
  icon:Activity,
  description:
  "Therapy focused on practical skills such as walking, transfers, hand function, and returning to daily routines."
},


{
  title:"Long-Term Support",
  icon:HeartPulse,
  description:
  "Ongoing rehabilitation can help people manage fatigue, maintain independence, and adapt to changing needs."
}

];


export default function Rehabilitation(){

return(
<>


<PageHeader

eyebrow="Support Resources"

title="Physiotherapy & Rehabilitation"

subtitle="Recovery from GBS, CIDP, and MMN often involves rehabilitation. Explore how physiotherapy and supportive care can help restore function and improve quality of life."

/>



<motion.section

className="section"

initial="hidden"

whileInView="show"

viewport={{once:true,amount:.2}}

variants={fadeUp}

>

<div className="container">


<div className="rehab-intro card">


<Accessibility size={42}/>


<h2>
Rehabilitation is part of recovery
</h2>


<p>
Physiotherapy and rehabilitation help people regain strength,
improve mobility, manage symptoms, and build confidence after
neurological illness or injury.
</p>


</div>


</div>


</motion.section>






<section className="section">

<div className="container">


<div className="section-head">

<p className="eyebrow">
Rehabilitation Services
</p>


<h2>
Support for every stage of recovery
</h2>

</div>



<div className="rehab-grid">


{services.map((service,index)=>{

const Icon=service.icon;


return(

<motion.article

key={service.title}

className="rehab-card"

initial={{
opacity:0,
y:20
}}

whileInView={{
opacity:1,
y:0
}}

viewport={{
once:true
}}

transition={{
duration:.5,
delay:index*.1
}}

>


<div className="rehab-icon">

<Icon size={32}/>

</div>


<h3>
{service.title}
</h3>


<p>
{service.description}
</p>


</motion.article>

)

})}


</div>


</div>

</section>






<section className="section rehab-directory">

<div className="container">


<div className="rehab-directory__card">


<MapPin size={36}/>


<div>

<h2>
Finding rehabilitation services in Kenya
</h2>


<p>
Look for rehabilitation departments in referral hospitals,
physiotherapy clinics, and neurological rehabilitation centres.
Your neurologist or healthcare team can also provide referrals
based on your needs.
</p>


</div>


</div>


</div>

</section>



</>

)

}