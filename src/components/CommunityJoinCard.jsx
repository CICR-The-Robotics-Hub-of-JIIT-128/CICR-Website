import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function CommunityJoinCard() {
  return (
    <section className="join-community-card-section" id="community">
      <div className="join-community-card">
        {/* Heading */}
        <h3 className="join-card-title">Ready to join our community?</h3>

        {/* Subtitle */}
        <p className="join-card-subtitle">
          Learn by building, fail by experimenting, and grow by creating alongside people who share your passion for robotics.
        </p>

        {/* CTA White Pill Button with Arrow */}
        <div className="join-card-btn-row">
          <a
            href="https://chat.whatsapp.com/JxQJozp3DRO5eipFBK9Tqd?s=cl&p=a&iam=2"
            target="_blank"
            rel="noopener noreferrer"
            className="become-member-white-btn"
          >
            <span>Become a Member</span>
            <ArrowRight size={17} className="btn-arrow-right" />
          </a>
        </div>
      </div>
    </section>
  );
}
