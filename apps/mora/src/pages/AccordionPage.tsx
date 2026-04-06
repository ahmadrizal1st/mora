// src/pages/AccordionPage.tsx
import BaseLayout from '../layouts/BaseLayout'
import { Accordion } from '../components/ui/Accordion'
import questions from '../data/questions.json'

export default function AccordionPage() {
  return (
    <BaseLayout pageTitle="Accordion" pagePretitle="Base">
      <div className="row row-cards">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <Accordion items={questions} id="default" />
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <Accordion items={questions} type="flush" id="flush" />
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <Accordion items={questions} type="tabs" id="tabs" />
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <Accordion items={questions} type="inverted" id="inverted" />
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <Accordion 
                items={questions} 
                id="inverted-plus" 
                type={["inverted", "plus"]} 
                toggleIcon="plus" 
              />
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <Accordion items={questions} id="icons" showIcon />
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}
