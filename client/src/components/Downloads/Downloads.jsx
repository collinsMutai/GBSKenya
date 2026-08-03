import { motion } from "framer-motion";
import {
  FileText,
  Download,
  ClipboardCheck,
  BookOpen,
  HeartPulse,
  Printer,
} from "lucide-react";

import PageHeader from "../PageHeader/PageHeader.jsx";
import "./Downloads.css";


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


const downloads = [

{
  title:"GBS Patient Guide",
  description:
  "A simple guide explaining GBS symptoms, diagnosis, treatment options, recovery, and rehabilitation.",
  icon:BookOpen,
  type:"PDF Guide"
},


{
  title:"CIDP & MMN Information Guide",
  description:
  "Understand chronic neurological conditions, treatment approaches, and living well with ongoing care.",
  icon:FileText,
  type:"Patient Resource"
},


{
  title:"Caregiver Checklist",
  description:
  "Practical reminders for appointments, medications, mobility support, and emotional wellbeing.",
  icon:ClipboardCheck,
  type:"Checklist"
},


{
  title:"Recovery Tracking Sheet",
  description:
  "Track symptoms, appointments, rehabilitation progress, and important questions for your healthcare team.",
  icon:HeartPulse,
  type:"Printable Tool"
},


];


export default function Downloads(){

return(
<>

<PageHeader

eyebrow="Support Resources"

title="Download Centre"

subtitle="Access practical guides, checklists, and educational materials designed to support patients, caregivers, and families living with GBS, CIDP, and MMN."

/>



<motion.section

className="section"

initial="hidden"

whileInView="show"

viewport={{once:true,amount:.2}}

variants={fadeUp}

>

<div className="container">


<div className="downloads-intro card">


<FileText size={42}/>


<h2>
Helpful resources you can keep
</h2>


<p>
Download and print resources to help you prepare for medical
appointments, understand your condition, support recovery, and
care for a loved one.
</p>


</div>


</div>


</motion.section>






<section className="section">


<div className="container">


<div className="section-head">

<p className="eyebrow">
Downloads
</p>


<h2>
Patient and caregiver resources
</h2>

</div>



<div className="downloads-grid">


{downloads.map((item,index)=>{

const Icon=item.icon;


return(

<motion.article

key={item.title}

className="download-card"

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


<div className="download-icon">

<Icon size={32}/>

</div>


<span className="download-type">
{item.type}
</span>


<h3>
{item.title}
</h3>


<p>
{item.description}
</p>



<button className="btn btn-primary">

<Download size={18}/>

Download PDF

</button>


</motion.article>

)

})}


</div>


</div>


</section>






<section className="section downloads-print">


<div className="container">


<div className="downloads-print__card">


<Printer size={36}/>


<div>

<h2>
Need printed materials?
</h2>


<p>
If you need physical copies for clinics, support groups, or
caregiver meetings, contact our team for assistance.
</p>


</div>


</div>


</div>


</section>


</>

)

}