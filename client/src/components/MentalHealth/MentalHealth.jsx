import { motion } from "framer-motion";
import {
  Brain,
  HeartHandshake,
  MessagesSquare,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import PageHeader from "../PageHeader/PageHeader.jsx";
import "./MentalHealth.css";


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


const supportAreas = [

{
  title:"Emotional Support After Diagnosis",
  icon:Brain,
  description:
  "A new neurological diagnosis can bring fear, uncertainty, stress, and many questions. Emotional support can help patients and families adjust."
},


{
  title:"Counselling & Talking Support",
  icon:MessagesSquare,
  description:
  "Professional counselling provides a safe space to discuss emotions, coping challenges, relationships, and life changes."
},


{
  title:"Caregiver Support",
  icon:HeartHandshake,
  description:
  "Caregivers also need support. Learning healthy coping strategies can prevent burnout and improve quality of care."
},


{
  title:"Building Resilience",
  icon:Sparkles,
  description:
  "Support groups, community connections, and positive coping strategies can help people maintain hope throughout recovery."
}

];


export default function MentalHealth(){

return(
<>


<PageHeader

eyebrow="Support Resources"

title="Mental Health & Counselling Support"

subtitle="Living with GBS, CIDP, or MMN affects more than physical health. Emotional wellbeing, mental health support, and strong connections are important parts of recovery."

/>




<motion.section

className="section"

initial="hidden"

whileInView="show"

viewport={{once:true,amount:.2}}

variants={fadeUp}

>

<div className="container">


<div className="mental-intro card">


<HeartHandshake size={42}/>


<h2>
You are not alone on this journey
</h2>


<p>
Changes in mobility, independence, work, family roles, and
daily routines can be challenging. Speaking with a counsellor
or mental health professional can provide practical tools and
emotional support.
</p>


</div>


</div>


</motion.section>






<section className="section">


<div className="container">


<div className="section-head">

<p className="eyebrow">
Mental Wellness
</p>

<h2>
Support for patients and families
</h2>

</div>



<div className="mental-grid">


{supportAreas.map((item,index)=>{

const Icon=item.icon;


return(

<motion.article

key={item.title}

className="mental-card"

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


<div className="mental-icon">

<Icon size={32}/>

</div>


<h3>
{item.title}
</h3>


<p>
{item.description}
</p>


</motion.article>

)

})}


</div>


</div>


</section>







<section className="section mental-help">


<div className="container">


<div className="mental-help__card">


<ShieldCheck size={38}/>


<div>

<h2>
Finding counselling support in Kenya
</h2>


<p>
Mental health support may be available through hospitals,
licensed counsellors, psychologists, faith-based organisations,
and community health programmes. Ask your healthcare provider
for referrals that match your needs.
</p>


</div>


</div>


</div>


</section>


</>

)

}