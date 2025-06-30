export function Form({formTitle, submitMessage, children, buttonEvent}) {
  return (
    <>
      <form className="flex flex-col">
        <h2 className="max-xl:text-4xl min-xl:text-6xl font-bold">{formTitle}</h2>
        {children}
        <button className="btn btn-outline border-2 p-3 rounded-lg bg-black text-2xl font-bold self-center" onClick={buttonEvent}>{submitMessage}</button>
      </form>
    </>
  );
}
