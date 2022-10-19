type TownWaypoint = {
  name: string
}

const SailboatWaypoint: TownWaypoint = {
  name: "Sailboat",
}

const WildernessWaypoint: TownWaypoint = {
  name: "Wilderness",
}

export const towns = [
  { name: "Teristraz", waypoints: [SailboatWaypoint, WildernessWaypoint] },
]
