import { motion } from "framer-motion";
import { useState } from "react";
import {
  ChevronDown,
  HelpCircle,
  MessageCircleQuestion,
} from "lucide-react";

import PageHeader from "../PageHeader/PageHeader.jsx";
import "./ResourcesFAQ.css";


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


const questions = [

{
  question:"What is Guillain-Barré Syndrome (GBS)?",
  answer:
  "GBS is a rare neurological condition where the body's immune system mistakenly attacks peripheral nerves. It can cause weakness, numbness, tingling, and difficulty walking."
},


{
  question:"What is the difference between GBS and CIDP?",
  answer:
  "GBS usually develops quickly over days or weeks, while CIDP is a longer-term condition that progresses over several weeks or months and may require ongoing treatment."
},


{
  question:"Can people recover from GBS?",
  answer:
  "Many people with GBS improve with appropriate treatment and rehabilitation. Recovery varies depending on the severity of illness and individual circumstances."
},


{
  question:"What treatments are available?",
  answer:
  "Treatment options may include IVIg, plasma exchange, medications, physiotherapy, rehabilitation, and supportive care depending on the condition."
},


{
  question:"Why is physiotherapy important?",
  answer:
  "Physiotherapy helps improve strength, balance, mobility, independence, and confidence during recovery and long-term management."
},


{
  question:"Where can I find specialist care in Kenya?",
  answer:
  "Neurologists, referral hospitals, and rehabilitation centres can provide assessment and ongoing care. Your healthcare provider can guide you toward appropriate services."
},


{
  question:"How can caregivers support someone living with these conditions?",
  answer:
  "Caregivers can help with appointments, emotional support, daily activities, rehabilitation routines, and creating a safe recovery environment."
}

];



export default function ResourcesFAQ(){

const [active,setActive]=useState(null);


return(
<>

<PageHeader

eyebrow="Support Resources"

title="Frequently Asked Questions"

subtitle="Answers to common questions about GBS, CIDP, MMN, diagnosis, treatment, recovery, and supporting loved ones."

/>




<motion.section

className="section"

initial="hidden"

whileInView="show"

viewport={{once:true,amount:.2}}

variants={fadeUp}

>

<div className="container">


<div className="faq-intro card">


<HelpCircle size={42}/>


<h2>
Need quick answers?
</h2>


<p>
Browse frequently asked questions about neurological conditions,
care, treatment options, and recovery support.
</p>


</div>


</div>

</motion.section>





<section className="section">


<div className="container">


<div className="faq-list">


{questions.map((item,index)=>{


const open = active === index;


return(

<motion.article

key={item.question}

className={`faq-item ${open ? "active":""}`}

initial={{
opacity:0,
y:15
}}

whileInView={{
opacity:1,
y:0
}}

viewport={{
once:true
}}

transition={{
duration:.4,
delay:index*.05
}}

>


<button

className="faq-question"

onClick={()=>setActive(open ? null:index)}

>

<div>

<MessageCircleQuestion size={22}/>

<span>
{item.question}
</span>

</div>


<ChevronDown

size={22}

className={open ? "rotate":""}

/>


</button>



{open && (

<motion.div

className="faq-answer"

initial={{
height:0,
opacity:0
}}

animate={{
height:"auto",
opacity:1
}}

>

<p>
{item.answer}
</p>

</motion.div>

)}


</motion.article>

)

})}


</div>


</div>


</section>


</>

)

}