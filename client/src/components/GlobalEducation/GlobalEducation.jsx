import { motion } from "framer-motion";
import {
  Globe2,
  BookOpen,
  Microscope,
  Video,
  ExternalLink,
  GraduationCap,
} from "lucide-react";

import PageHeader from "../PageHeader/PageHeader.jsx";
import "./GlobalEducation.css";


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


const resources = [

{
  title:"Global Education Centre",
  icon:BookOpen,
  description:
  "Access international educational materials about GBS, CIDP, MMN, symptoms, treatment options, and living with neurological conditions.",
  link:"https://www.gbs-cidp.org"
},


{
  title:"Research & Clinical Updates",
  icon:Microscope,
  description:
  "Explore research information, scientific updates, and advances in diagnosis and treatment from the global neurological community.",
  link:"https://www.gbs-cidp.org"
},


{
  title:"Webinars & Learning Events",
  icon:Video,
  description:
  "Watch educational sessions covering patient experiences, treatments, rehabilitation, and healthcare topics.",
  link:"https://www.gbs-cidp.org"
},


{
  title:"Patient Education Library",
  icon:GraduationCap,
  description:
  "Find guides and learning resources designed for patients, caregivers, and healthcare professionals.",
  link:"https://www.gbs-cidp.org"
}

];


export default function GlobalEducation(){

return(
<>

<PageHeader

eyebrow="Support Resources"

title="Global Education & Research"

subtitle="Connect with international education resources, research updates, and learning opportunities through trusted neurological organisations."

/>



<motion.section

className="section"

initial="hidden"

whileInView="show"

viewport={{once:true,amount:.2}}

variants={fadeUp}

>

<div className="container">


<div className="global-intro card">


<Globe2 size={42}/>


<h2>
Learning beyond borders
</h2>


<p>
Our community is connected to global organisations that provide
education, research information, and support resources for people
living with GBS, CIDP, MMN, caregivers, and healthcare providers.
</p>


</div>


</div>


</motion.section>





<section className="section">


<div className="container">


<div className="section-head">

<p className="eyebrow">
International Resources
</p>


<h2>
Explore trusted learning materials
</h2>

</div>




<div className="global-grid">


{resources.map((resource,index)=>{


const Icon=resource.icon;


return(

<motion.article

key={resource.title}

className="global-card"

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


<div className="global-icon">

<Icon size={32}/>

</div>



<h3>
{resource.title}
</h3>



<p>
{resource.description}
</p>



<a

href={resource.link}

target="_blank"

rel="noopener noreferrer"

>

Visit Resource

<ExternalLink size={16}/>

</a>


</motion.article>

)

})}


</div>


</div>


</section>






<section className="section global-connect">


<div className="container">


<div className="global-connect__card">


<Globe2 size={38}/>


<div>

<h2>
GBS/CIDP Foundation International
</h2>


<p>
Visit the global education centre for additional patient
guides, research information, webinars, and international
support resources.
</p>


<a

href="https://www.gbs-cidp.org"

target="_blank"

rel="noopener noreferrer"

className="btn btn-primary"

>

Explore Global Resources

<ExternalLink size={18}/>

</a>


</div>


</div>


</div>


</section>


</>

)

}