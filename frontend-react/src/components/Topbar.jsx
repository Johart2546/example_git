export default function Topbar({ title }) {
  return (
    <header className="topbar">
      <h1 className="topbar__title">{title}</h1>
      <div className="topbar__user">
        <span className="avatar" aria-hidden="true">
          นส
        </span>
        <div className="topbar__user-meta">
          <span className="topbar__user-name">ณัฐวุฒิ ส.</span>
          <span className="topbar__user-role">พนักงาน</span>
        </div>
      </div>
    </header>
  );
}
