import { motion } from "framer-motion";
import PageHeader from "../PageHeader/PageHeader.jsx";
import "./MedicalAdvisoryBoard.css";


const fadeUp = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};


const advisors = [
  {
    name: "Dr. Jeffrey Allen",
    role: "Neurologist",
    image: "https://i.pravatar.cc/500?img=11",
  },
  {
    name: "Dr. Diana Castro",
    role: "Neuromuscular Specialist",
    image: "https://i.pravatar.cc/500?img=32",
  },
  {
    name: "Dr. Peter Donofrio",
    role: "Neurologist",
    image: "https://i.pravatar.cc/500?img=14",
  },
  {
    name: "Dr. Bart C. Jacobs",
    role: "Clinical Researcher",
    image: "https://i.pravatar.cc/500?img=12",
  },
  {
    name: "Dr. Richard Lewis",
    role: "Neurology Specialist",
    image: "https://i.pravatar.cc/500?img=15",
  },
  {
    name: "Dr. Sami Khella",
    role: "Neurologist",
    image: "https://i.pravatar.cc/500?img=18",
  },
];


export default function MedicalAdvisoryBoard() {

return (
<>

<PageHeader
  eyebrow="About us"
  title="Global Medical Advisory Board"
  subtitle="Connecting patients, families, and healthcare professionals with expert guidance and knowledge in GBS, CIDP, MMN, and related neurological conditions."
/>



{/* Expert Guidance */}

<motion.section
className="section medical-board__intro"
initial="hidden"
whileInView="show"
viewport={{once:true, amount:.3}}
variants={fadeUp}
>

<div className="container medical-board__grid">


<div>

<p className="eyebrow">
Expert guidance
</p>

<h2>
Advancing knowledge and better care
</h2>

<p>
Our Global Medical Advisory Board brings together experienced
neurologists, researchers, and healthcare professionals who provide
expert insight into GBS, CIDP, MMN, and related conditions.
</p>

</div>



<div>

<p className="eyebrow">
Our role
</p>

<h2>
Supporting patients through expertise
</h2>

<p>
The advisory board helps strengthen education, awareness,
research collaboration, and access to trusted medical information
for communities affected by rare neurological conditions.
</p>

</div>


</div>

</motion.section>





{/* Impact */}

<motion.section
className="section medical-board__impact"
initial="hidden"
whileInView="show"
viewport={{once:true, amount:.3}}
variants={fadeUp}
>

<div className="container">


<div className="medical-board__impact-card">


<p className="eyebrow">
Our impact
</p>


<h2>
Strengthening knowledge and patient support
</h2>


<p>
Through collaboration with medical experts, GBS Foundation Kenya
promotes accurate information, strengthens healthcare awareness,
supports research collaboration, and helps communities affected by
GBS, CIDP, MMN, and related neurological conditions access trusted
medical guidance.
</p>


</div>


</div>

</motion.section>







{/* Advisory Members */}

<motion.section
className="section medical-board__members"
initial="hidden"
whileInView="show"
viewport={{once:true, amount:.3}}
variants={fadeUp}
>

<div className="container">


<div className="section-head">

<p className="eyebrow">
Medical experts
</p>

<h2>
Meet our advisory board
</h2>

<p>
Our advisors represent leading expertise in diagnosis,
treatment, research, and patient care.
</p>

</div>





<div className="medical-board__grid-cards">


{advisors.map((advisor,index)=>(

<motion.article
key={advisor.name}
className="medical-card card"
initial={{opacity:0,y:20}}
whileInView={{opacity:1,y:0}}
viewport={{once:true}}
transition={{
duration:.5,
delay:index*.1
}}
>


<img
src={advisor.image}
alt={advisor.name}
className="medical-card__image"
/>



<div>

<h3>
{advisor.name}
</h3>


<p>
{advisor.role}
</p>


</div>


</motion.article>

))}


</div>

</div>

</motion.section>


</>

)

}