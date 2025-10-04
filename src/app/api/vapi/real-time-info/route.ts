import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('📊 VAPI Real-time Info webhook:', body)

    const { info_type } = body.message?.toolCalls?.[0]?.function?.arguments || {}

    // Real-time event information
    const eventInfo = {
      schedule: {
        current_time: new Date().toLocaleTimeString(),
        current_activity: getCurrentActivity(),
        next_activity: getNextActivity(),
        remaining_events: [
          { time: '1:00 PM', activity: 'Slavic Food Lunch' },
          { time: '2:00 PM', activity: 'Sound Healing Session' },
          { time: '5:00 PM', activity: 'Final Demos & Judging' },
          { time: '7:00 PM', activity: 'Awards & Closing' }
        ]
      },
      mentors: {
        available_now: [
          { name: 'Sarah Kim', company: 'OpenAI', expertise: 'AI/ML', location: 'Mentor Zone A' },
          { name: 'Marcus Rodriguez', company: 'Vercel', expertise: 'Full-stack', location: 'Mentor Zone B' },
          { name: 'Emily Zhang', company: 'Anthropic', expertise: 'AI Safety', location: 'Mentor Zone C' }
        ],
        busy: [
          { name: 'David Park', company: 'Google', expertise: 'Cloud/Infrastructure', available_at: '2:30 PM' }
        ],
        total_available: 12
      },
      food: {
        current_serving: 'Slavic Lunch - Plov, Pirozhki, Crepes',
        location: 'Main Dining Area',
        next_meal: 'Snacks & Coffee - 3:30 PM',
        dietary_options: ['Vegetarian', 'Vegan', 'Gluten-free available']
      },
      activities: {
        happening_now: getCurrentActivity(),
        upcoming: [
          { time: '2:00 PM', activity: 'Sound Healing & Meditation', location: 'Meditation Dome' },
          { time: '3:00 PM', activity: 'Networking Break', location: 'Main Hall' },
          { time: '4:00 PM', activity: 'Final Sprint', location: 'Work Areas' }
        ]
      },
      announcements: [
        '🔥 Demo submissions close at 4:30 PM sharp!',
        '✨ Sound healing session starting in 15 minutes',
        '📱 WiFi: "BurningHeroes2025" / Password: "hackathon"',
        '🏆 Prize announcements at 7 PM'
      ]
    }

    const info = eventInfo[info_type as keyof typeof eventInfo] || eventInfo.schedule

    const response = {
      results: [
        {
          toolCallId: body.message?.toolCalls?.[0]?.id,
          result: {
            success: true,
            info_type,
            data: info,
            message: formatInfoMessage(info_type, info)
          }
        }
      ]
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('VAPI Real-time Info error:', error)
    return NextResponse.json(
      { error: 'Failed to get real-time info' },
      { status: 500 }
    )
  }
}

function getCurrentActivity(): string {
  const now = new Date()
  const hour = now.getHours()
  
  if (hour < 10) return 'Check-in & Tea Ceremony'
  if (hour < 11) return 'Kickoff & Team Formation'
  if (hour < 13) return 'Build Time & Mentor Sessions'
  if (hour < 14) return 'Slavic Food Lunch'
  if (hour < 15) return 'Sound Healing Session'
  if (hour < 17) return 'Build Time & Final Sprint'
  if (hour < 19) return 'Final Demos & Judging'
  return 'Awards & Closing'
}

function getNextActivity(): string {
  const now = new Date()
  const hour = now.getHours()
  
  if (hour < 10) return 'Kickoff & Team Formation (10:00 AM)'
  if (hour < 11) return 'Build Time & Mentor Sessions (10:30 AM)'
  if (hour < 13) return 'Slavic Food Lunch (1:00 PM)'
  if (hour < 14) return 'Sound Healing Session (2:00 PM)'
  if (hour < 15) return 'Build Time & Final Sprint (3:00 PM)'
  if (hour < 17) return 'Final Demos & Judging (5:00 PM)'
  if (hour < 19) return 'Awards & Closing (7:00 PM)'
  return 'Event Complete - Thanks for participating! 🔥'
}

function formatInfoMessage(infoType: string, data: any): string {
  switch (infoType) {
    case 'schedule':
      return `Right now we're in "${data.current_activity}" and next up is "${data.next_activity}". The current time is ${data.current_time}.`
    
    case 'mentors':
      return `We have ${data.available_now.length} mentors available right now: ${data.available_now.map((m: any) => `${m.name} from ${m.company} (${m.expertise})`).join(', ')}. You can find them in the Mentor Zone!`
    
    case 'food':
      return `We're currently serving ${data.current_serving} in the ${data.location}. Next meal is ${data.next_meal}. We have ${data.dietary_options.join(', ')} options available.`
    
    case 'activities':
      return `Right now: ${data.happening_now}. Coming up: ${data.upcoming.map((a: any) => `${a.activity} at ${a.time}`).join(', ')}.`
    
    case 'announcements':
      return `Here are the latest announcements: ${data.join(' • ')}`
    
    default:
      return 'I have the latest event information for you!'
  }
}
