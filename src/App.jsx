import './App.css';
import AROverlay from './components/AROverlay/AROverlay';

/**
 * App.jsx
 * 
 * Component รากของแอปพลิเคชัน
 * ทำหน้าที่สร้าง Layout พื้นฐานและ Render <AROverlay /> ซึ่งเป็นหน้าหลักของแอป
 */
function App() {
  // ไม่มี State หรือ useEffect ที่ซับซ้อนอีกต่อไป
  // มันจะ Render <AROverlay /> ทันทีที่เปิดแอป

  return (
    <div className="app-background">
      <div className="app-container">
        <AROverlay />
      </div>
    </div>
  );
}

export default App;