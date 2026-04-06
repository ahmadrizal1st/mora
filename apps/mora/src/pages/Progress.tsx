import React, { useState, useEffect } from 'react';
import BaseLayout from '../layouts/BaseLayout';
import { 
  Progress, 
  ProgressBg, 
  ProgressDescription, 
  ProgressSteps,
  Button
} from '../components/ui';

const ProgressPage: React.FC = () => {
  // Animation state for the JavaScript demo
  const [animatedValue, setAnimatedValue] = useState(38);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedValue((prev) => {
        if (prev >= 100) return 100;
        const increment = Math.ceil(Math.random() * 10);
        return Math.min(prev + increment, 100);
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const updateAnimatedValue = (val: number, relative = false) => {
    if (relative) {
      setAnimatedValue((prev) => Math.min(Math.max(prev + val, 0), 100));
    } else {
      setAnimatedValue(Math.min(Math.max(val, 0), 100));
    }
  };

  return (
    <BaseLayout pageTitle="Progress">
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
        {/* Default */}
        <div className="col">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Default</h3>
              <div className="space-y">
                <Progress value={0} />
                <Progress value={20} />
                <Progress value={40} />
                <Progress value={100} />
              </div>
            </div>
          </div>
        </div>

        {/* With value */}
        <div className="col">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">With value</h3>
              <div className="space-y">
                <Progress value={10} showValue size="lg" />
                <Progress value={20} showValue size="lg" />
                <Progress value={90} showValue size="lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Colors */}
        <div className="col">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Colors</h3>
              <div className="space-y">
                <Progress color="blue" value={20} />
                <Progress color="green" value={40} />
                <Progress color="yellow" value={60} />
                <Progress color="red" value={80} />
              </div>
            </div>
          </div>
        </div>

        {/* Sizes */}
        <div className="col">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Sizes</h3>
              <div className="space-y">
                <Progress value={20} size="sm" />
                <Progress value={40} />
                <Progress value={60} size="lg" />
                <Progress value={80} size="xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Indeterminate */}
        <div className="col">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Indeterminate</h3>
              <div className="space-y">
                <Progress indeterminate />
              </div>
            </div>
          </div>
        </div>

        {/* Multiple values */}
        <div className="col">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Multiple values</h3>
              <div className="space-y">
                <Progress values={[20, 30, 10]} />
                <Progress values={[10, 20, 30, 40]} className="progress-separated" />
              </div>
            </div>
          </div>
        </div>

        {/* Striped */}
        <div className="col">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Striped</h3>
              <div className="space-y">
                <Progress color="blue" value={20} striped />
                <Progress color="green" value={40} striped />
                <Progress color="yellow" value={60} striped />
                <Progress color="red" value={80} striped />
              </div>
            </div>
          </div>
        </div>

        {/* Animated */}
        <div className="col">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Animated</h3>
              <div className="space-y">
                <Progress value={20} striped animated />
                <Progress value={40} color="green" striped animated />
                <Progress value={60} color="yellow" striped animated />
                <Progress value={80} color="red" striped animated />
              </div>
            </div>
          </div>
        </div>

        {/* Animated with JavaScript */}
        <div className="col">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Animated with JavaScript</h3>
              <div className="row align-items-center g-0">
                <div className="col">
                  <Progress value={animatedValue} color={animatedValue >= 100 ? 'green' : undefined} />
                </div>
                <div className="col-2 text-end">
                  {animatedValue}%
                </div>
              </div>
              <div className="btn-list mt-3">
                <Button size="sm" onClick={() => updateAnimatedValue(0)}>0%</Button>
                <Button size="sm" onClick={() => updateAnimatedValue(10)}>10%</Button>
                <Button size="sm" onClick={() => updateAnimatedValue(50)}>50%</Button>
                <Button size="sm" onClick={() => updateAnimatedValue(100)}>100%</Button>
                <Button size="sm" className="ms-3" onClick={() => updateAnimatedValue(-10, true)}>-10%</Button>
                <Button size="sm" onClick={() => updateAnimatedValue(10, true)}>+10%</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Steps Progress */}
        <div className="col">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Steps Progress</h3>
              <div className="space-y">
                <ProgressSteps count={3} />
                <ProgressSteps count={5} active={4} />
                <ProgressSteps count={10} color="red" />
                <ProgressSteps count={8} color="green" active={8} />
              </div>
            </div>
          </div>
        </div>

        {/* Progress Background */}
        <div className="col">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Progress Background</h3>
              <div className="space-y">
                <ProgressBg value={85} text="Poland" showValue />
                <ProgressBg value={65} text="Germany" showValue />
                <ProgressBg value={45} text="United States" showValue />
                <ProgressBg value={25} text="France" showValue />
              </div>
            </div>
          </div>
        </div>

        {/* Progress Background Colors */}
        <div className="col">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Progress Background Colors</h3>
              <div className="space-y">
                <ProgressBg value={75} text="Success" color="success-lt" showValue />
                <ProgressBg value={60} text="Warning" color="warning-lt" showValue />
                <ProgressBg value={40} text="Danger" color="danger-lt" showValue />
                <ProgressBg value={90} text="Info" color="info-lt" showValue />
              </div>
            </div>
          </div>
        </div>

        {/* Progress Description */}
        <div className="col">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Progress Description</h3>
              <div className="space-y">
                <ProgressDescription label="Project completion" value={85} color="green" />
                <ProgressDescription label="Storage usage" description="2.4GB of 5GB" value={48} color="blue" />
                <ProgressDescription label="Download progress" value={75} color="yellow" />
                <ProgressDescription label="Skills assessment" description="HTML/CSS" value={92} color="red" />
              </div>
            </div>
          </div>
        </div>

        {/* Progress Description Sizes */}
        <div className="col">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Progress Description Sizes</h3>
              <div className="space-y">
                <ProgressDescription label="Small progress" value={60} size="sm" color="blue" />
                <ProgressDescription label="Default progress" value={70} color="green" />
                <ProgressDescription label="Large progress" value={80} size="lg" color="orange" />
                <ProgressDescription label="Extra large" value={90} size="xl" color="purple" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default ProgressPage;
