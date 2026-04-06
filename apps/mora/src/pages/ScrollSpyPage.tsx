// src/pages/ScrollSpyPage.tsx
import React, { useEffect } from 'react';
import BaseLayout from '../layouts/BaseLayout';

const headers = ["Home", "Profile", "Messages", "Settings", "About", "Contact", "Services", "Team", "Work"];

function slugify(text: string) {
  return text.toLowerCase().replace(/\s+/g, '-');
}

const ScrollSpyPage: React.FC = () => {
  useEffect(() => {
    // Initialize Bootstrap ScrollSpy if needed
    // In many Tabler/Bootstrap setups, data attributes are enough, 
    // but sometimes manual initialization is required in React.
    // However, Tabler's tabler.min.js usually handles [data-bs-spy="scroll"] automatically.
    
    // If it doesn't work automatically, we might need:
    // const scrollSpy = new bootstrap.ScrollSpy(document.body, { target: '#pills' });
  }, []);

  return (
    <BaseLayout pageTitle="Scroll Spy">
      <div className="row g-5">
        <div className="col-sm-2">
          <div className="sticky-top">
            <h3 className="mb-3">Menu</h3>
            <nav className="nav nav-vertical nav-pills" id="pills">
              {headers.map((header) => (
                <a 
                  key={header} 
                  className="nav-link" 
                  href={`#pills-${slugify(header)}`}
                >
                  {header}
                </a>
              ))}
            </nav>
          </div>
        </div>
        <div 
          className="col-sm" 
          data-bs-spy="scroll" 
          data-bs-target="#pills" 
          data-bs-offset="0"
          style={{ position: 'relative', height: '100%' }}
        >
          <div className="card card-lg">
            <div className="card-body">
              {headers.map((header) => (
                <div key={header} className="mb-6">
                  <h3 id={`pills-${slugify(header)}`}>{header}</h3>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. A accusantium, alias autem beatae blanditiis corporis debitis eligendi, enim error excepturi exercitationem odit porro quasi reiciendis saepe sapiente veritatis? Aliquam
                    assumenda beatae, cumque delectus dolorem enim, eveniet facere fugit harum illum iure magnam nemo neque nisi omnis, pariatur tenetur vel? Accusantium aut cum deleniti dolor doloribus eum, molestiae nulla officiis quasi. At
                    cupiditate dolor explicabo id nesciunt placeat unde voluptates. Asperiores cum doloremque esse fugit labore quia reprehenderit similique. Architecto est ipsum maiores odio perferendis quibusdam tempore velit? Accusantium aliquid
                    consequatur corporis dignissimos distinctio eos eum fugiat impedit nam obcaecati officiis, porro, quia quibusdam repellendus sapiente suscipit temporibus ullam velit vitae voluptates? Aliquam consectetur consequatur consequuntur
                    deleniti dicta dolores ducimus, excepturi ipsam iure molestias necessitatibus numquam optio quaerat quasi quo repudiandae sed. Ad aliquam animi beatae culpa delectus esse excepturi in incidunt ipsam iusto labore laboriosam minima,
                    nam, nemo nisi nobis, nulla praesentium provident quae quaerat qui quia quibusdam quis quisquam quos repellendus sint suscipit tempora vero vitae! Animi assumenda dolorum eaque, explicabo laborum officia praesentium quia
                    repudiandae. Aliquam asperiores cupiditate deserunt nobis nostrum reprehenderit voluptates? Dolorem doloremque ducimus magni, maxime sint tenetur totam. Accusamus atque beatae consequatur corporis, dignissimos dolore dolores
                    dolorum earum error eum eveniet, facere impedit incidunt minima molestias nemo non nostrum placeat quasi qui ratione repudiandae suscipit tenetur ullam vel velit voluptatibus. Accusantium alias assumenda blanditiis consectetur
                    cupiditate delectus dolor dolores dolorum, ducimus eaque enim, error esse eum fugiat fugit id ipsam ipsum laboriosam laudantium minus modi molestias mollitia necessitatibus nihil odio officia praesentium quaerat quis quisquam quos
                    reiciendis tempora tempore ut velit vitae voluptas voluptatem! Accusantium adipisci architecto assumenda atque aut consectetur consequuntur cum, deserunt doloribus ea excepturi exercitationem expedita explicabo facere fuga fugit
                    impedit iste iusto laboriosam molestiae nihil officiis perferendis porro possimus provident quae quaerat qui quibusdam quos reiciendis repellendus vel vero, voluptatem! Ab amet aperiam assumenda aut error eveniet, id inventore
                    laudantium molestias mollitia natus neque nulla officiis, porro quam quas quisquam repellendus repudiandae saepe sapiente ut voluptas, voluptate. Ab ad alias, aliquam atque consequatur culpa deserunt distinctio eius, enim est ex
                    exercitationem facere facilis itaque magni maiores modi nemo neque perferendis placeat quam quas quia quis quod quos reiciendis sequi sunt tempore vero vitae! Earum explicabo nam quaerat quam quos sed voluptatem. Asperiores
                    debitis dolorum, eaque eligendi optio ullam velit? Aperiam beatae cumque earum et explicabo maxime modi molestias odit, omnis placeat quasi quibusdam, ratione sapiente vel voluptas? A, aliquid beatae dolore eaque eos excepturi
                    expedita facere facilis fugit ipsam iure molestiae molestias natus necessitatibus, nesciunt nulla, numquam obcaecati officia offices pariatur quaerat quas quisquam rerum sapiente veniam. A aperiam beatae distinctio et illum
                    laboriosam necessitatibus obcaecati porro sed vero. Accusantium at aut consequatur corporis culpa cupiditate delectus dolores eius eligendi, enim error esse est, et excepturi fugit id ipsam ipsum itaque modi mollitia
                    necessitatibus neque non nulla obcaecati officia placeat qui quia saepe sit temporibus totam ut voluptas voluptatibus? Ad consectetur eos est illum laboriosam minus molestiae officia placeat quas tenetur.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default ScrollSpyPage;
