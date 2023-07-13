import { UIEvent, UIEventHandler, useCallback, useState } from 'react';

import './TermsAndConditions.scss';

type TermsAndConditionsProps = {
  onScroll?: UIEventHandler<HTMLDivElement>;
};
export function TermsAndConditions({ onScroll }: TermsAndConditionsProps) {
  return (
    <div className='terms-container' onScroll={onScroll}>
      <h1>UID2 SHARING PORTAL TERMS OF SERVICE</h1>
      <p>
        These Terms of Service (“<span className='terms-bold'>Terms</span>”) apply to your use of
        the UID2 Sharing Portal (“<span className='terms-bold'>Portal</span>”), which is designed to
        enable users to share UID2s with third-party participants designated through the Portal. You
        may only use the Portal in connection with performing work for a company (each, a “
        <span className='terms-bold'>Company</span>”) that has entered into an agreement(s) with TD
        (as defined below) to participate in a proof-of-concept trial of the UID2 technology (the “
        <span className='terms-bold'>POC Agreement</span>”). For purposes of these Terms, “
        <span className='terms-bold'>TD</span>” will mean (a) The Trade Desk, Inc. if Company is
        domiciled in the United States, or (b) the UK Trade Desk Limited if Company is domiciled in
        any country or territory outside of the United States.
      </p>
      <div>
        In connection with your use of the Portal, you agree to comply with these Terms, any terms
        of the POC Agreement and any documentation provided by TD. You and Company are jointly
        liable for any breach of those obligations by you.
      </div>
      <h2>1 Authorization</h2>
      <div>
        You represent, warrant and covenant to the following: (1) You (or your affiliate) have
        entered into a POC Agreement with TD; (2) such POC Agreement will remain in effect for the
        duration of your use of the Portal; (3) you have been duly authorized to act for and on
        behalf of such party that has entered into that certain POC Agreement, and are authorized to
        bind such party to these Terms and your use of the Portal; and (3) you have obtained all
        necessary rights, licenses, and approvals in your use of the Portal and you will provide
        only accurate information when using the Portal.
      </div>
      <h2>2 User Account and Account Security</h2>
      <div>
        When you register for an account through the Portal (the “
        <span className='terms-bold'>Account</span>”), you will need to provide required information
        and complete all required steps. You must own, control or have all necessary rights to
        provide all account information for yourself and others, including but not limited to email
        addresses. We may send verification codes and other administrative messages to the contact
        information you use to register for your Account. You are solely responsible for protecting
        access to your Account, and you should not otherwise share your login or password to your
        Account with any third party. Account creation is subject to TD’s approval, in its sole
        discretion.
      </div>
      <h2>3 Prohibited Conduct and Content</h2>
      <div>
        <table>
          <tr>
            <td>(a)</td>
            <td>
              You will not violate any applicable law, contract, intellectual property right or
              other third-party right or commit a tort, and you are responsible for your conduct
              while using the Portal. You will not:
              <ul>
                <li>Use or attempt to use another user’s Account;</li>
                <li>Sell or resell the Portal; </li>
                <li>
                  Copy, reproduce, distribute, publicly perform or publicly display all or portions
                  of the Portal;
                </li>
                <li>
                  Modify the Portal, remove any proprietary rights notices or markings, or otherwise
                  make any derivative works based upon the Portal;
                </li>
                <li>
                  Use the Portal other than for its intended purpose and in any manner that could
                  interfere with, disrupt, negatively affect or inhibit other users from using the
                  Portal or that could damage, disable, overburden or impair the functioning of the
                  Portal in any manner;
                </li>
                <li>
                  Reverse engineer any aspect of the Portal or do anything that might discover
                  source code or bypass or circumvent measures employed to prevent or limit access
                  to any part of the Portal;
                </li>
                <li>
                  Use any data mining, robots or similar data gathering or extraction methods
                  designed to scrape or extract data from the Portal;
                </li>
                <li>
                  Develop or use any applications that interact with the Portal without TD’s prior
                  written consent;
                </li>
                <li>
                  Use the Portal for any illegal or unauthorized purpose in contravention of the POC
                  Agreement, or engage in, encourage or promote any activity that violates these
                  Terms.
                </li>
              </ul>
            </td>
          </tr>
          <tr>
            <td>(b)</td>
            <td>
              Enforcement of this Section 3 is solely at TD’s discretion, and failure to enforce
              this section in some instances does not constitute a waiver of TD’s right to enforce
              it in other instances.
            </td>
          </tr>
        </table>
      </div>
      <h2>4 Ownership; Limited License</h2>
      <div>
        The Portal is owned by TD or its licensors and is protected under both United States and
        foreign laws. Except as explicitly stated in these Terms, all rights in and to the Portal
        are reserved by TD or its licensors. Subject to your compliance with these Terms, you are
        hereby granted a limited, nonexclusive, nontransferable, non-sublicensable, revocable
        license to access and use the Portal as authorized in these Terms. Any use of the Portal
        other than as specifically authorized herein, without TD’s prior written permission, is
        strictly prohibited, will terminate the license granted herein and violate TD’s or its
        licensors’ intellectual property rights.
      </div>
      <h2>5 Feedback</h2>
      <div>
        You may voluntarily post, submit or otherwise communicate to TD any questions, comments,
        suggestions, ideas, original or creative materials or other information about TD or the
        Portal (which includes your Account) (collectively, “
        <span className='terms-bold'>Feedback</span>”). You understand that TD may use such Feedback
        for any purpose, commercial or otherwise, without acknowledgment or compensation to you,
        including to develop, copy, publish, or improve the Feedback in TD’s sole discretion. You
        understand that TD may treat Feedback as nonconfidential.
      </div>
      <h2>6 Indemnification</h2>
      <div>
        To the fullest extent permitted by applicable law, Company will indemnify, defend (at TD’s
        option) and hold harmless TD and its affiliates, and each of their respective officers,
        directors, agents, partners and employees (individually and collectively, “
        <span className='terms-bold'>TD Parties</span>”) from and against any losses, liabilities,
        claims, demands, damages, expenses or costs (“<span className='terms-bold'>Claims</span>”)
        arising out of or related to your violation of these Terms. Company agrees to pay all fees,
        costs and expenses associated with defending Claims (including attorneys’ fees) and will
        cooperate with the TD Parties in defending such Claims. Company also agrees that TD Parties
        will have control of the defense or settlement, at TD’s sole option, of any third-party
        Claims. This indemnity is in addition to, and not in lieu of, any other indemnities set
        forth in a written agreement between Company and TD or the other TD Parties (including any
        POC Agreement).
      </div>
      <h2>7 Disclaimers</h2>
      <div className='terms-bold'>
        Your use of the Portal is at your sole risk. The Portal and any content therein are provided
        “as is” and “as available” without warranties of any kind, either express or implied,
        including implied warranties of merchantability, fitness for a particular purpose, title,
        and non-infringement. In addition, TD does not represent or warrant that the Portal is
        accurate, complete, reliable, current or error-free.
      </div>
      <h2>8 Limitation of Liability</h2>
      <div className='terms-bold'>
        <table>
          <tr>
            <td>(a)</td>
            <td>
              To the fullest extent permitted by applicable law, TD and the other TD Parties will
              not be liable to you or Company under any theory of liability – whether based in
              contract, tort, negligence, strict liability, warranty, or otherwise – for any
              indirect, consequential, exemplary, incidental, punitive or special damages or lost
              profits, even if TD or the other TD Parties have been advised of the possibility of
              such damages.
            </td>
          </tr>
          <tr>
            <td>(b)</td>
            <td>
              The total liability of TD and the TD Parties for any claim arising out of or relating
              to these Terms or the Portal, regardless of the form of the action, is limited to the
              amount Company or you has paid (if any) to use the Portal.
            </td>
          </tr>
          <tr>
            <td>(c)</td>
            <td>
              The limitations set forth in this Section 8 will not limit or exclude liability for
              the gross negligence, fraud or intentional misconduct of TD or TD Parties or for any
              other matters in which liability cannot be excluded or limited under applicable law.
              Additionally, some jurisdictions do not allow the exclusion or limitation of
              incidental or consequential damages, so the above limitations or exclusions may not
              apply to you.
            </td>
          </tr>
        </table>
      </div>
      <h2>9 Governing Law; Jurisdiction.</h2>
      <div>
        These Terms and any disputes hereunder will be governed by the governing law and dispute
        resolution clause set forth in the POC Agreement.
      </div>
      <h2>10 Modifying and Terminating the Portal</h2>
      <div>
        TD reserves the right to modify the Portal or to suspend or stop providing all or portions
        of the Portal at any time. You also have the right to stop using the Portal at any time. We
        are not responsible for any loss or harm related to your inability to access or use the
        Portal.
      </div>
      <h2>11 Amendments</h2>
      <div>
        TD may make changes to these Terms from time to time. If TD makes changes, TD will provide
        you with notice of such changes, such as by sending an email or providing a notice through
        the Portal. Unless TD says otherwise in the notice, the amended Terms will be effective
        immediately, and your continued use of the Portal after TD provides such notice will confirm
        acceptance of the changes. If you or Company do not agree to the amended Terms, you must
        stop using the Portal.
      </div>
      <h2>12 Severability</h2>
      <div>
        If any provision or part of a provision of these Terms is unlawful, void or unenforceable,
        that provision or part of the provision is deemed severable from these Terms and does not
        affect the validity and enforceability of any remaining provisions.
      </div>
      <h2>13 Miscellaneous</h2>
      <div>
        The failure of TD to exercise or enforce any right or provision of these Terms will not
        operate as a waiver of such right or provision. These Terms reflect the entire agreement
        between the parties relating to the subject matter hereof and supersede all prior
        agreements, representations, statements and understandings of the parties. The section
        titles in these Terms are for convenience only and have no legal or contractual effect. Use
        of the word “including” will be interpreted to mean “including without limitation.” Except
        as otherwise provided herein, these Terms are intended solely for the benefit of the parties
        and are not intended to confer third-party beneficiary rights upon any other person or
        entity. You agree that communications and transactions between you and TD may be conducted
        electronically.
      </div>
    </div>
  );
}

type TermsAndConditionsFormProps = {
  onAccept: () => void;
  onCancel: () => void;
};

export type AcceptTermForm = {
  acceptConditions: boolean;
};

export function TermsAndConditionsForm({ onAccept, onCancel }: TermsAndConditionsFormProps) {
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const handleScroll = useCallback((event: UIEvent<HTMLDivElement>) => {
    const { scrollHeight, scrollTop, clientHeight } = event.currentTarget;
    const scrollPos = scrollHeight - scrollTop - clientHeight;
    if (scrollPos < 20) setScrolledToBottom(true);
  }, []);
  return (
    <div className='terms-and-conditions-form'>
      <TermsAndConditions onScroll={handleScroll} />
      <button
        type='button'
        className='primary-button'
        onClick={onAccept}
        disabled={!scrolledToBottom}
      >
        Accept Terms & Conditions
      </button>
      <button type='button' className='text-button' onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
}
