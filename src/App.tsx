import React from 'react';
import './App.css';


type Choice = 'real_birds' | 'fake_birds'

type Data = {
  [choice in Choice]: string[];
};

const useData = () => {
  const [data, setData] = React.useState<Data>({} as Data)

  React.useEffect(() => {
    (async () => {
      const res = await fetch('real_birds.txt')
      const real_birds = (await res.text()).split('\n') as string[];
      setData(data => ({ ...data, real_birds }))
    })()
  }, [])

  React.useEffect(() => {
    (async () => {
      const res = await fetch('fake_birds.txt')
      const fake_birds = (await res.text()).split('\n') as string[];
      setData(data => ({ ...data, fake_birds }))
    })()
  }, [])

  return data
}

const sample = <T extends any>(items: T[]): T => {
  const index = Math.floor(Math.random() * items.length)
  return items[index]
}

interface Bird {
  key: Choice;
  text: string;
}

const useRandomBird = (): [Bird | undefined, () => void] => {
  const [bird, setBird] = React.useState<Bird>()
  const data = useData()

  const reset = () => setBird(undefined)

  React.useEffect(() => {
    if (!data.real_birds || !data.fake_birds) return;
    if (bird) return;

    const key = sample<Choice>(['real_birds', 'fake_birds'])
    const text = sample(data[key])

    setBird({ key, text })
  }, [data, bird])

  return [bird, reset]
}

const Chooser = ({ onAnswer }: { onAnswer: (answer: Choice) => void }) => {
  return (<>
    <button className="Real Choice" onClick={() => onAnswer('real_birds')}>Real</button>
    <button className="Fake Choice" onClick={() => onAnswer('fake_birds')}>Fake</button>
  </>);
}

function App() {
  const [bird, resetBird] = useRandomBird()
  const [answer, setAnswer] = React.useState<Choice | undefined>()

  const reset = () => {
    setAnswer(undefined)
    resetBird();
  }


  if (!bird) return null

  return (
    <div className="App">
      <div className="Content">
        <h1 className="BirdName">{bird.text}</h1>

        {answer && (
          <div>
            <h1>{answer === bird.key ? 'Correct!' : 'Wrong!'}</h1>

            <p>
              This bird is <strong>{bird.key === 'real_birds' ? 'real' : 'fake'}</strong>
            </p>
          </div>
        )}


        {answer
          ? <button className="Try-Again" onClick={reset}>Try Again</button>
          : <Chooser onAnswer={setAnswer} />
        }
      </div>
    </div>
  );
}

export default App;
