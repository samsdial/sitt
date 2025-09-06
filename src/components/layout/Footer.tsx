export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4 mt-6">
      <div className="container mx-auto text-center">
        <p>
          {new Date().getFullYear()} Mi tienda de comercio electrónico. Todos
          los derechos reservados..
        </p>
      </div>
    </footer>
  );
}
