export const Email = () => {
  return (
    <div>
      <ul className="pb-4 border-b flex flex-col gap-2">
        <li>
          <span className="font-bold">From:</span> <span>foo@example.com</span>
        </li>
        <li>
          <span className="font-bold">To:</span> <span>bar@example.com</span>
        </li>
        <li>
          <span className="font-bold">Subject:</span> <span>Hello!</span>
        </li>
        <li>
          <span className="font-bold">Timestamp:</span>{" "}
          <span>Mar 25, 2024, 5:25PM</span>
        </li>
      </ul>
      <p className="my-4">Hello World</p>
    </div>
  )
}
