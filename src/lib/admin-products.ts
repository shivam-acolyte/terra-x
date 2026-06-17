export type AdminProduct = {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
};

export const adminProducts: AdminProduct[] = [
  {
    id: "rovx-ai-orchard-rover",
    name: "RoVX-AI Orchard Rover",
    description:
      "Autonomous orchard rover for tree-level plant health scanning, fertilizer dosing, and farm monitoring.",
    price: "INR 24,50,000",
    category: "Agriculture Robotics",
  },
  {
    id: "rovx-ai-sprayer-kit",
    name: "RoVX-AI Precision Sprayer Kit",
    description:
      "Smart spraying attachment with AI-assisted crop targeting, flow control, and field coverage tracking.",
    price: "INR 4,80,000",
    category: "Agriculture Attachments",
  },
  {
    id: "rovx-ai-fertilizer-dispenser",
    name: "RoVX-AI Fertilizer Dispenser",
    description:
      "Robotic fertilizer dispensing module for orchard rows, controlled by task maps and plant health data.",
    price: "INR 5,25,000",
    category: "Agriculture Attachments",
  },
  {
    id: "rovx-ai-plant-health-camera",
    name: "RoVX-AI Plant Health Camera",
    description:
      "Multispectral crop camera module for detecting stress, disease patterns, and plant health variation.",
    price: "INR 2,75,000",
    category: "Sensors & Vision",
  },
  {
    id: "rovx-ai-orchard-mapping-pack",
    name: "RoVX-AI Orchard Mapping Pack",
    description:
      "Mapping package for orchard boundaries, row planning, route generation, and tree-level digital records.",
    price: "INR 3,60,000",
    category: "AI Software",
  },
  {
    id: "rovx-ai-remote-operator-console",
    name: "RoVX-AI Remote Operator Console",
    description:
      "Portable operator station for remote machine control, camera views, telemetry, and task assignment.",
    price: "INR 6,40,000",
    category: "Remote Operations",
  },
  {
    id: "rovx-ai-field-battery-pack",
    name: "RoVX-AI Field Battery Pack",
    description:
      "Rugged auxiliary battery system for extended field operations and remote agricultural deployments.",
    price: "INR 3,20,000",
    category: "Power Systems",
  },
  {
    id: "rovx-ai-tractor-assist-module",
    name: "RoVX-AI Tractor Assist Module",
    description:
      "AI-assisted steering and route guidance module for tractor-based orchard and farm operations.",
    price: "INR 7,90,000",
    category: "Autonomy Systems",
  },
  {
    id: "rovx-ai-terrain-wheel-kit",
    name: "RoVX-AI All-Terrain Wheel Kit",
    description:
      "Heavy-duty wheel and traction upgrade for muddy fields, orchard lanes, and uneven farm terrain.",
    price: "INR 2,95,000",
    category: "Mobility Upgrades",
  },
  {
    id: "rovx-ai-farm-analytics-dashboard",
    name: "RoVX-AI Farm Analytics Dashboard",
    description:
      "Cloud dashboard for machine activity, crop health reports, service logs, and farm productivity insights.",
    price: "INR 1,20,000 / year",
    category: "AI Software",
  },
  {
    id: "rambo-x-amphibious-excavator",
    name: "RAMBO-X Amphibious Excavator",
    description:
      "Autonomous amphibious excavator platform for land, water, rescue, disaster response, and defense use.",
    price: "INR 1,85,00,000",
    category: "Autonomous Heavy Machinery",
  },
  {
    id: "rambo-x-land-excavation-kit",
    name: "RAMBO-X Land Excavation Kit",
    description:
      "Excavation control package for autonomous digging, grading, trenching, and earthmoving operations.",
    price: "INR 18,50,000",
    category: "Excavation Attachments",
  },
  {
    id: "rambo-x-amphibious-track-kit",
    name: "RAMBO-X Amphibious Track Kit",
    description:
      "Track and flotation upgrade for soft soil, swamp, riverbank, and flood-zone deployment.",
    price: "INR 32,00,000",
    category: "Mobility Upgrades",
  },
  {
    id: "rambo-x-rescue-bucket",
    name: "RAMBO-X Rescue Bucket",
    description:
      "Specialized bucket attachment for flood debris handling, rescue clearing, and disaster-zone operations.",
    price: "INR 6,75,000",
    category: "Rescue Attachments",
  },
  {
    id: "rambo-x-ai-navigation-stack",
    name: "RAMBO-X AI Navigation Stack",
    description:
      "Autonomous navigation package with perception, route planning, obstacle detection, and operator assist.",
    price: "INR 28,00,000",
    category: "Autonomy Systems",
  },
  {
    id: "rambo-x-lidar-perception-unit",
    name: "RAMBO-X LiDAR Perception Unit",
    description:
      "Rugged LiDAR sensor unit for 3D mapping, worksite awareness, and autonomous movement safety.",
    price: "INR 9,60,000",
    category: "Sensors & Vision",
  },
  {
    id: "rambo-x-radar-safety-pack",
    name: "RAMBO-X Radar Safety Pack",
    description:
      "Radar-based proximity awareness system for low-visibility work, rescue zones, and defense operations.",
    price: "INR 8,40,000",
    category: "Safety Systems",
  },
  {
    id: "rambo-x-drone-integration-kit",
    name: "RAMBO-X Drone Integration Kit",
    description:
      "Drone telemetry and mission sync package for aerial scouting, mapping, and machine guidance.",
    price: "INR 12,75,000",
    category: "Mission Systems",
  },
  {
    id: "rambo-x-medical-evacuation-module",
    name: "RAMBO-X Medical Evacuation Module",
    description:
      "Emergency rescue module for moving supplies or evacuation payloads in dangerous terrain.",
    price: "INR 14,90,000",
    category: "Rescue Systems",
  },
  {
    id: "rambo-x-remote-command-station",
    name: "RAMBO-X Remote Command Station",
    description:
      "Command station with multi-camera feed, machine telemetry, remote controls, and mission monitoring.",
    price: "INR 16,50,000",
    category: "Remote Operations",
  },
  {
    id: "navy-rambo-x-coastal-platform",
    name: "Navy Version RAMBO-X Coastal Platform",
    description:
      "Specialized RAMBO-X variant for shoreline work, coastal defense support, and amphibious utility tasks.",
    price: "INR 2,25,00,000",
    category: "Navy & Coastal Systems",
  },
  {
    id: "navy-rambo-x-sonar-kit",
    name: "Navy RAMBO-X Sonar Kit",
    description:
      "Sonar-ready integration package for shallow-water awareness, underwater obstacle checks, and mission support.",
    price: "INR 22,00,000",
    category: "Navy & Coastal Systems",
  },
  {
    id: "navy-rambo-x-saltwater-protection-pack",
    name: "Navy RAMBO-X Saltwater Protection Pack",
    description:
      "Anti-corrosion protection upgrade for coastal humidity, saltwater exposure, and long-duration deployment.",
    price: "INR 11,80,000",
    category: "Protection Upgrades",
  },
  {
    id: "navy-rambo-x-shoreline-clearing-bucket",
    name: "Navy RAMBO-X Shoreline Clearing Bucket",
    description:
      "Heavy-duty bucket for clearing silt, debris, shore obstacles, and flood-damaged coastal areas.",
    price: "INR 8,25,000",
    category: "Navy Attachments",
  },
  {
    id: "navy-rambo-x-amphibious-rescue-skid",
    name: "Navy RAMBO-X Amphibious Rescue Skid",
    description:
      "Rescue skid module for moving supplies, equipment, or emergency payloads in water-linked terrain.",
    price: "INR 13,60,000",
    category: "Rescue Systems",
  },
  {
    id: "navy-rambo-x-coastal-surveillance-pack",
    name: "Navy RAMBO-X Coastal Surveillance Pack",
    description:
      "Camera, radar, and telemetry package for shoreline monitoring and operator-assisted mission awareness.",
    price: "INR 19,40,000",
    category: "Mission Systems",
  },
  {
    id: "navy-rambo-x-night-vision-kit",
    name: "Navy RAMBO-X Night Vision Kit",
    description:
      "Low-light and thermal vision module for night rescue, defense support, and restricted visibility work.",
    price: "INR 10,75,000",
    category: "Sensors & Vision",
  },
  {
    id: "navy-rambo-x-waterproof-command-link",
    name: "Navy RAMBO-X Waterproof Command Link",
    description:
      "Rugged communication link for reliable remote control near water, rain, and coastal conditions.",
    price: "INR 7,90,000",
    category: "Communication Systems",
  },
  {
    id: "navy-rambo-x-port-utility-package",
    name: "Navy RAMBO-X Port Utility Package",
    description:
      "Utility package for port maintenance, dockside clearing, material movement, and coastal infrastructure work.",
    price: "INR 24,50,000",
    category: "Navy & Coastal Systems",
  },
  {
    id: "navy-rambo-x-flood-response-package",
    name: "Navy RAMBO-X Flood Response Package",
    description:
      "Flood-response package with rescue tools, water-ready mobility support, and rapid deployment accessories.",
    price: "INR 29,00,000",
    category: "Rescue Systems",
  },
  {
    id: "terra-x-ai-control-core",
    name: "Terra-X AI Control Core",
    description:
      "Central AI control unit for machine decision support, mission rules, sensor fusion, and safety logic.",
    price: "INR 15,75,000",
    category: "AI Hardware",
  },
  {
    id: "terra-x-autonomy-retrofit-kit",
    name: "Terra-X Autonomy Retrofit Kit",
    description:
      "Retrofit package to add assisted autonomy, sensors, remote control, and operator safety features to machines.",
    price: "INR 38,00,000",
    category: "Autonomy Systems",
  },
  {
    id: "terra-x-machine-telemetry-unit",
    name: "Terra-X Machine Telemetry Unit",
    description:
      "Telemetry module for live machine status, location, health data, operator activity, and diagnostics.",
    price: "INR 3,95,000",
    category: "IoT & Telemetry",
  },
  {
    id: "terra-x-fleet-dashboard",
    name: "Terra-X Fleet Dashboard",
    description:
      "Fleet management dashboard for tracking machines, uptime, job progress, service alerts, and reports.",
    price: "INR 2,40,000 / year",
    category: "AI Software",
  },
  {
    id: "terra-x-operator-mobile-app",
    name: "Terra-X Operator Mobile App",
    description:
      "Mobile app subscription for job assignment, remote monitoring, alerts, and operator workflow management.",
    price: "INR 72,000 / year",
    category: "AI Software",
  },
  {
    id: "terra-x-voice-command-module",
    name: "Terra-X Voice Command Module",
    description:
      "Voice command interface for supported machine actions, task confirmations, and operator-assist workflows.",
    price: "INR 2,10,000",
    category: "Remote Operations",
  },
  {
    id: "terra-x-safety-stop-system",
    name: "Terra-X Safety Stop System",
    description:
      "Emergency stop package with remote shutdown, geofence limits, and operator safety trigger controls.",
    price: "INR 1,85,000",
    category: "Safety Systems",
  },
  {
    id: "terra-x-geofence-module",
    name: "Terra-X Geofence Module",
    description:
      "Geofence control module for restricting machine movement within approved work zones and route boundaries.",
    price: "INR 2,65,000",
    category: "Safety Systems",
  },
  {
    id: "terra-x-360-camera-kit",
    name: "Terra-X 360 Camera Kit",
    description:
      "Rugged multi-camera package for surrounding visibility, remote operation, and worksite safety.",
    price: "INR 4,35,000",
    category: "Sensors & Vision",
  },
  {
    id: "terra-x-thermal-camera-kit",
    name: "Terra-X Thermal Camera Kit",
    description:
      "Thermal imaging package for night operations, rescue work, human detection, and equipment monitoring.",
    price: "INR 6,25,000",
    category: "Sensors & Vision",
  },
  {
    id: "terra-x-rugged-router",
    name: "Terra-X Rugged Router",
    description:
      "Industrial wireless router for field connectivity, command station links, and machine data sync.",
    price: "INR 1,55,000",
    category: "Communication Systems",
  },
  {
    id: "terra-x-edge-compute-box",
    name: "Terra-X Edge Compute Box",
    description:
      "On-machine compute unit for AI inference, sensor processing, route planning, and task execution logic.",
    price: "INR 9,85,000",
    category: "AI Hardware",
  },
  {
    id: "terra-x-rugged-display-unit",
    name: "Terra-X Rugged Display Unit",
    description:
      "Cabin or command station display for telemetry, camera views, route data, and mission feedback.",
    price: "INR 2,45,000",
    category: "Remote Operations",
  },
  {
    id: "terra-x-machine-health-monitor",
    name: "Terra-X Machine Health Monitor",
    description:
      "Predictive maintenance module for tracking engine load, hydraulics, temperature, vibration, and alerts.",
    price: "INR 3,30,000",
    category: "IoT & Telemetry",
  },
  {
    id: "terra-x-hydraulic-control-interface",
    name: "Terra-X Hydraulic Control Interface",
    description:
      "Control interface for autonomous or remote-assisted hydraulic movement on supported heavy machines.",
    price: "INR 7,25,000",
    category: "Control Systems",
  },
  {
    id: "terra-x-tool-change-adapter",
    name: "Terra-X Tool Change Adapter",
    description:
      "Attachment adapter for switching buckets, rescue tools, farm implements, and mission-specific hardware.",
    price: "INR 3,75,000",
    category: "Attachments",
  },
  {
    id: "terra-x-heavy-duty-grapple",
    name: "Terra-X Heavy Duty Grapple",
    description:
      "Grapple attachment for debris lifting, rescue clearing, construction handling, and field operations.",
    price: "INR 5,95,000",
    category: "Attachments",
  },
  {
    id: "terra-x-trenching-bucket",
    name: "Terra-X Trenching Bucket",
    description:
      "Precision trenching bucket for land development, irrigation lines, utility work, and controlled digging.",
    price: "INR 4,50,000",
    category: "Excavation Attachments",
  },
  {
    id: "terra-x-grading-blade",
    name: "Terra-X Grading Blade",
    description:
      "Grading blade attachment for leveling, site preparation, farm tracks, and terrain finishing.",
    price: "INR 5,25,000",
    category: "Excavation Attachments",
  },
  {
    id: "terra-x-debris-clearing-rake",
    name: "Terra-X Debris Clearing Rake",
    description:
      "Rake attachment for disaster debris, flood cleanup, field clearing, and construction-site preparation.",
    price: "INR 4,20,000",
    category: "Rescue Attachments",
  },
  {
    id: "terra-x-field-service-plan-basic",
    name: "Terra-X Field Service Plan Basic",
    description:
      "Annual service plan with scheduled inspection, remote diagnostics, software updates, and basic support.",
    price: "INR 1,50,000 / year",
    category: "Service Plans",
  },
  {
    id: "terra-x-field-service-plan-pro",
    name: "Terra-X Field Service Plan Pro",
    description:
      "Priority annual service plan with preventive maintenance, emergency support, diagnostics, and updates.",
    price: "INR 4,80,000 / year",
    category: "Service Plans",
  },
  {
    id: "terra-x-operator-training-basic",
    name: "Terra-X Operator Training Basic",
    description:
      "Training program for safe machine handling, remote control, field workflow, and emergency procedures.",
    price: "INR 85,000",
    category: "Training",
  },
  {
    id: "terra-x-autonomy-training-advanced",
    name: "Terra-X Autonomy Training Advanced",
    description:
      "Advanced operator training for autonomous workflows, mission planning, sensor checks, and diagnostics.",
    price: "INR 1,65,000",
    category: "Training",
  },
  {
    id: "terra-x-site-survey-service",
    name: "Terra-X Site Survey Service",
    description:
      "Professional site survey for deployment planning, machine suitability, route mapping, and risk review.",
    price: "INR 1,10,000",
    category: "Services",
  },
  {
    id: "terra-x-custom-integration-service",
    name: "Terra-X Custom Integration Service",
    description:
      "Engineering service for custom sensors, machine integrations, workflows, dashboards, and mission tools.",
    price: "INR 6,00,000",
    category: "Services",
  },
  {
    id: "terra-x-pilot-deployment-package",
    name: "Terra-X Pilot Deployment Package",
    description:
      "Pilot program package for testing Terra-X machines, collecting field data, and validating use cases.",
    price: "INR 12,00,000",
    category: "Services",
  },
  {
    id: "terra-x-defense-readiness-assessment",
    name: "Terra-X Defense Readiness Assessment",
    description:
      "Assessment service for defense, rescue, and tactical machine deployment readiness and mission fit.",
    price: "INR 3,50,000",
    category: "Defense & Rescue",
  },
  {
    id: "terra-x-flood-rescue-readiness-kit",
    name: "Terra-X Flood Rescue Readiness Kit",
    description:
      "Rapid deployment kit with rescue attachments, checklists, emergency controls, and field support tools.",
    price: "INR 9,75,000",
    category: "Defense & Rescue",
  },
  {
    id: "terra-x-construction-autonomy-pack",
    name: "Terra-X Construction Autonomy Pack",
    description:
      "Automation package for construction excavation, site grading, operator assist, and machine telemetry.",
    price: "INR 26,00,000",
    category: "Construction Automation",
  },
  {
    id: "terra-x-mining-safety-monitor",
    name: "Terra-X Mining Safety Monitor",
    description:
      "Monitoring package for hazardous machine zones, remote alerts, thermal checks, and operator safety.",
    price: "INR 7,80,000",
    category: "Safety Systems",
  },
  {
    id: "terra-x-industrial-robotics-consulting",
    name: "Terra-X Industrial Robotics Consulting",
    description:
      "Consulting service for automation strategy, robotics adoption, machine selection, and operational planning.",
    price: "INR 2,25,000",
    category: "Services",
  },
];
