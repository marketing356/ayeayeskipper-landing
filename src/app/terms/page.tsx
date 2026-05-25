import Nav from '@/components/Nav'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service & Disclaimers — AyeAyeSkipper',
  description: 'Terms of Service, Hot Slip™ Program Terms, Transient Booking Terms, Privacy Policy, and Liability Disclaimers for AyeAyeSkipper.',
}

const NAVY = '#0d2b4b'
const TEAL = '#4dd6c8'
const DARK = '#070f1a'
const FONT = "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"

export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', background: DARK, fontFamily: FONT, color: '#fff' }}>
      <Nav />

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px 100px' }}>
        {/* Header */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(77,214,200,0.1)', border: '1px solid rgba(77,214,200,0.25)', borderRadius: 24, padding: '6px 16px', marginBottom: 20 }}>
            <span style={{ fontSize: 12, color: TEAL, fontWeight: 700, letterSpacing: '1px' }}>LEGAL</span>
          </div>
          <h1 style={{ fontSize: 'clamp(32px,5vw,48px)', fontWeight: 900, letterSpacing: '-2px', margin: '0 0 16px', lineHeight: 1.05 }}>
            Terms of Service & Disclaimers
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.6 }}>
            Last updated: January 2026 · Effective for all AyeAyeSkipper platform accounts.
          </p>
        </div>

        {/* Sections */}
        {[
          {
            title: '1. Platform Terms',
            content: `AyeAyeSkipper ("the Platform," "we," "us") is a Software-as-a-Service marina management platform operated by Mariner and Sailor LLC. By accessing or using the Platform, you agree to be bound by these terms.

**Eligibility.** The Platform is intended for use by marina operators, marina staff, and authorized boaters aged 18 or older. You represent that you have the authority to bind your organization to these terms.

**License.** We grant you a limited, non-exclusive, non-transferable license to use the Platform in accordance with these terms and your subscription plan. This license does not include the right to sublicense, resell, or reverse-engineer any portion of the Platform.

**Account Security.** You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account. Notify us immediately of any unauthorized use.

**Acceptable Use.** You agree not to use the Platform to violate any applicable laws, infringe intellectual property rights, transmit harmful code, or interfere with the integrity or performance of the Platform.

**Modifications.** We reserve the right to modify these terms at any time. Continued use of the Platform after changes are posted constitutes acceptance of the revised terms.

**Termination.** Either party may terminate a subscription at any time. Upon termination, access to the Platform will cease at the end of the current billing period. We do not provide refunds for partial months.`
          },
          {
            title: '2. Hot Slip™ Program Terms',
            content: `Hot Slip™ is a feature that allows annual slip tenants ("Tenants") to make their slip available for transient bookings during periods when they are away from the marina ("Hot Slip Period").

**Marina Control.** The slip remains under marina management and control at all times during the Hot Slip Period. The Tenant does not transfer possession of the slip — the marina continues to manage the physical slip, enforce marina rules, and maintain operational oversight.

**Tenant Liability.** During the Hot Slip Period, Tenant liability is limited to the standard terms of their existing slip lease agreement. The Tenant is not responsible for transient guest conduct, vessel damage, or incidents that occur during the Hot Slip Period, provided the Tenant properly activated the feature and their own vessel is not present.

**Platform Role.** AyeAyeSkipper is a technology platform, not a party to the agreement between the marina and any tenant or transient guest. AyeAyeSkipper facilitates the booking and revenue-sharing calculations but does not assume liability for marina-tenant or marina-guest disputes.

**Transaction Fees.** AyeAyeSkipper charges transaction fees to the transient boater at the time of booking, not to the marina or the annual tenant. Marina subscription fees are separate and governed by your marina's subscription plan.

**Revenue Split.** The revenue split between marina and tenant is configured by the marina operator. AyeAyeSkipper is not responsible for disputes regarding revenue allocation between marinas and their tenants.

**Opt-In Only.** Hot Slip™ is always optional for tenants. Marinas may enable or restrict the feature on a per-slip or per-dock basis.

**Insurance.** Marina operators are advised to confirm that their existing liability insurance covers transient guests booked through Hot Slip™. AyeAyeSkipper does not provide insurance coverage.`
          },
          {
            title: '3. Transient Booking Terms',
            content: `**Booking Confirmation.** A transient booking is confirmed when the boater receives a confirmation from AyeAyeSkipper. Confirmed bookings are subject to marina slip availability and marina rules.

**Cancellation.** Cancellation policies are set by the individual marina. Review the specific marina's cancellation terms prior to booking. AyeAyeSkipper is not responsible for individual marina cancellation decisions.

**Boater Responsibilities.** Transient boaters agree to comply with all marina rules, pay applicable fees, and depart by their confirmed checkout date. Failure to comply may result in removal and reporting to AyeAyeSkipper.

**Fees.** AyeAyeSkipper charges a service fee to transient boaters at the time of booking. This fee covers platform access, booking management, and payment processing. The slip nightly rate is set by the marina.

**Disputes.** For disputes regarding slip quality, marina conditions, or service issues, contact the marina directly. AyeAyeSkipper may assist in dispute resolution but is not the contracting party for marina services.`
          },
          {
            title: '4. Privacy Policy',
            content: `**Data We Collect.** We collect information you provide directly (name, email, marina details, vessel information), usage data (how you interact with the Platform), and technical data (IP address, browser type, device identifiers).

**How We Use Your Data.** We use your data to provide and improve the Platform, process bookings and payments, send service notifications, and comply with legal obligations. We do not sell your personal data to third parties.

**Data Sharing.** We may share data with service providers who assist us in operating the Platform (e.g., payment processors, email services) under confidentiality agreements. We may also share data when required by law.

**Marina Data.** Marina operators own their marina data (tenant lists, slip assignments, booking history). We process this data on your behalf as a data processor. You may export your data at any time.

**Retention.** We retain your data for as long as your account is active and for a reasonable period thereafter to comply with legal obligations.

**Contact.** For privacy-related questions, contact us at privacy@ayeayeskipper.com.`
          },
          {
            title: '5. Liability Disclaimer',
            content: `**AS-IS SERVICE.** THE PLATFORM IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED. AYEAYESKIPPER DOES NOT WARRANT THAT THE PLATFORM WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF HARMFUL COMPONENTS.

**LIMITATION OF LIABILITY.** TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, AYEAYESKIPPER, MARINER AND SAILOR LLC, AND THEIR OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE PLATFORM.

**MARINA-TENANT RELATIONSHIPS.** AYEAYESKIPPER IS A SOFTWARE PLATFORM AND IS NOT A PARTY TO AGREEMENTS BETWEEN MARINAS AND THEIR TENANTS OR TRANSIENT GUESTS. AYEAYESKIPPER IS NOT RESPONSIBLE FOR DISPUTES, ACCIDENTS, PROPERTY DAMAGE, OR PERSONAL INJURY THAT OCCUR AT MARINA FACILITIES.

**CAP ON LIABILITY.** IN ANY EVENT, AYEAYESKIPPER'S TOTAL LIABILITY TO YOU SHALL NOT EXCEED THE AMOUNT PAID BY YOU FOR PLATFORM SERVICES IN THE THREE (3) MONTHS PRECEDING THE CLAIM.

**INDEMNIFICATION.** You agree to indemnify and hold harmless AyeAyeSkipper and Mariner and Sailor LLC from any claims, damages, losses, or expenses arising from your use of the Platform, your violation of these terms, or your interaction with other users.`
          },
          {
            title: '6. Contact',
            content: `For questions about these terms, contact us at:

**Mariner and Sailor LLC**
Operating as AyeAyeSkipper
Email: legal@ayeayeskipper.com

For marina support: support@ayeayeskipper.com
For sales: sales@ayeayeskipper.com`
          },
        ].map((section, i) => (
          <div key={i} style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px', color: TEAL, marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid rgba(77,214,200,0.2)' }}>
              {section.title}
            </h2>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.85 }}>
              {section.content.split('\n\n').map((para, j) => (
                <p key={j} style={{ margin: '0 0 16px' }}>
                  {para.split(/(\*\*[^*]+\*\*)/).map((part, k) =>
                    part.startsWith('**') && part.endsWith('**')
                      ? <strong key={k} style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 700 }}>{part.slice(2, -2)}</strong>
                      : part
                  )}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
