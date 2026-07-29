import { useEffect, useRef, useState } from 'react';
import { PlayerRow } from './PlayerRow';
import type { Player, PlayerPosition } from '../types/team.types';

interface PlayerListProps {
  players: Player[];
  teamId: string;
}

const POSITION_PRIORITY: Record<PlayerPosition, number> = {
  GK: 0,
  DF: 1,
  MF: 2,
  FW: 3,
};

function normalizePosition(position: string | null | undefined): PlayerPosition | null {
  if (position === 'GK' || position === 'DF' || position === 'MF' || position === 'FW') {
    return position;
  }
  return null;
}

function sortPlayers(players: Player[]) {
  return [...players].sort((a, b) => {
    const aPos = normalizePosition(a.position);
    const bPos = normalizePosition(b.position);
    const aPriority = aPos === null ? 4 : POSITION_PRIORITY[aPos];
    const bPriority = bPos === null ? 4 : POSITION_PRIORITY[bPos];
    const positionDiff = aPriority - bPriority;
    if (positionDiff !== 0) return positionDiff;

    const aJersey = a.jersey_number ?? 999;
    const bJersey = b.jersey_number ?? 999;
    if (aJersey !== bJersey) return aJersey - bJersey;

    return a.full_name.localeCompare(b.full_name, undefined, { sensitivity: 'base' });
  });
}

export function PlayerList({ players, teamId }: PlayerListProps) {
  const [subsHeight, setSubsHeight] = useState(320);
  const subsResizingRef = useRef(false);
  const subsContainerRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    function handleMouseMove(event: MouseEvent) {
      if (!subsResizingRef.current) return;
      const panel = subsContainerRef.current;
      if (!panel) return;
      const listTop = panel.getBoundingClientRect().top;
      const newHeight = Math.max(120, Math.min(640, event.clientY - listTop));
      setSubsHeight(newHeight);
    }

    function handleMouseUp() {
      subsResizingRef.current = false;
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  if (players.length === 0) {
    return <p className="text-gray-500 p-6">No players yet. Add your first player above.</p>;
  }

  const sortedPlayers = sortPlayers(players);
  const starters = sortedPlayers.filter((player) => player.is_starter);
  const subs = sortedPlayers.filter((player) => !player.is_starter);

  return (
    <div className="space-y-6">
      <section>
        <div className="mb-3 flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-5 py-3">
          <div>
            <p className="text-sm font-semibold text-gray-900">Starters</p>
            <p className="text-xs text-gray-500">Primary lineup sorted by position.</p>
          </div>
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            {starters.length}
          </span>
        </div>
        {starters.length > 0 ? (
          <ul className="divide-y divide-gray-100 rounded-xl bg-white shadow-sm">
            <li className="sticky top-0 z-10 grid grid-cols-[40px_minmax(0,1fr)_96px_96px_64px] items-center gap-4 bg-white px-6 py-3 text-xs uppercase tracking-[0.12em] text-slate-500 shadow-sm">
              <span>#</span>
              <span>Player</span>
              <span className="text-center">Pos</span>
              <span className="text-center">Status</span>
              <span className="text-center">Actions</span>
            </li>
            {starters.map((player) => (
              <PlayerRow key={player.id} player={player} teamId={teamId} players={players} />
            ))}
          </ul>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-200 bg-white p-4 text-sm text-gray-500">
            No starters selected yet.
          </div>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-5 py-3">
          <div>
            <p className="text-sm font-semibold text-gray-900">Subs</p>
            <p className="text-xs text-gray-500">Substitutes sorted by position.</p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {subs.length}
          </span>
        </div>
        {subs.length > 0 ? (
          <div>
            <ul
              ref={subsContainerRef}
              className="divide-y divide-gray-100 rounded-xl bg-white shadow-sm overflow-y-auto"
              style={{ height: `${subsHeight}px` }}
            >
              <li className="sticky top-0 z-10 grid grid-cols-[40px_minmax(0,1fr)_96px_96px_64px] items-center gap-4 bg-white px-6 py-3 text-xs uppercase tracking-[0.12em] text-slate-500 shadow-sm">
                <span>#</span>
                <span>Player</span>
                <span className="text-center">Pos</span>
                <span className="text-center">Status</span>
                <span className="text-center">Actions</span>
              </li>
              {subs.map((player) => (
                <PlayerRow key={player.id} player={player} teamId={teamId} players={players} />
              ))}
            </ul>
            <div
              className="mt-1 flex cursor-row-resize select-none items-center justify-center rounded-b-xl border-t border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500"
              onMouseDown={(event) => {
                event.preventDefault();
                subsResizingRef.current = true;
              }}
            >
              Drag to resize subs
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-200 bg-white p-4 text-sm text-gray-500">
            No substitutes yet.
          </div>
        )}
      </section>
    </div>
  );
}
