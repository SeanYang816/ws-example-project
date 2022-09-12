import {useEffect, useMemo} from 'react'
import { log } from './utils'

function App() {
  const ws = useMemo(() => new WebSocket('ws://localhost:1234')
  , [])
  useEffect(() => {
    ws.addEventListener('open', () => {
      log('I am connected!')

      ws.send('I sent a message')
    })

    ws.addEventListener('message', e => {
      log(e)
    })
  }, [ws])

  return (
    <div>
      Hi
    </div>
  );
}

export default App;
