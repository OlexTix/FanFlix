import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Bogata oferta filmowa',
    Svg: require('@site/static/img/clapboard-svgrepo-com.svg').default,
    description: (
      <>
        Fanflix oferuje szeroką gamę filmów, w tym najnowsze hity kinowe, klasyki i filmy z całego świata.
      </>
    ),
  },
  {
    title: 'Wygodna rezerwacja biletów',
    Svg: require('@site/static/img/cinema-svgrepo-com.svg').default,
    description: (
      <>
        Użytkownicy mogą łatwo wybierać filmy, kina i godziny seansów, a także dokonywać płatności online.
      </>
    ),
  },
  {
    title: 'Personalizacja',
    Svg: require('@site/static/img/3d-glasses-svgrepo-com.svg').default,
    description: (
      <>
        System Fanflix oferuje możliwość personalizacji rekomendacji filmowych, co pozwala użytkownikom na łatwe znalezienie filmów dopasowanych do ich gustu.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
