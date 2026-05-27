// Main App — wires all sections together
function App() {
  return (
    <div>
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <Section1 />
        <Section2 />
        <Section3 />
        <Section4 />
        <Section5 />
        <Section6 />
        <Section7 />
        <Section8 />
        <Section8b />
        <Section9 />
        <Closing />
        <Biblio />
      </main>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
