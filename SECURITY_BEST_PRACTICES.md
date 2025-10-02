# Security Best Practices

## 🔐 Overview

This document outlines security best practices for the Unified Interoperability Adapter project to ensure sensitive information like credentials is never exposed in version control.

## 🚨 Critical Security Rules

### ❌ **NEVER Do This:**
- Commit usernames, passwords, or API keys directly in code
- Include credentials in configuration files that are tracked by Git
- Share credentials in public repositories or documentation
- Use default/weak passwords in production environments

### ✅ **ALWAYS Do This:**
- Use environment variables for sensitive configuration
- Keep credentials in local files that are in `.gitignore`
- Use strong, unique passwords for each environment
- Regularly rotate credentials and API keys

## 📁 File Security

### Protected Files (In .gitignore)
```
# Deployment and security files
deploy.sh                 # Contains deployment logic with credentials
deploy-config.env         # Contains actual credentials
.env.local               # Local environment variables
.env.production          # Production environment variables
auth-config.json         # Authentication configuration
credentials.json         # Any credential files
*.credentials           # All credential files
*.key                   # Private keys
*.pem                   # Certificate files
```

### Safe Files (Can be committed)
```
deploy.sh.template       # Template without real credentials
deploy-config.env.template  # Template with placeholder values
setup-secure-deploy.sh   # Setup script (no credentials)
SECURITY_BEST_PRACTICES.md  # This documentation
```

## 🛠️ Secure Deployment Setup

### First-Time Setup
1. **Run the setup script:**
   ```bash
   ./setup-secure-deploy.sh
   ```

2. **Edit configuration with your credentials:**
   ```bash
   # Edit deploy-config.env with actual values
   DEPLOY_USERNAME=your_actual_username
   DEPLOY_PASSWORD=your_secure_password
   ```

3. **Make deploy script executable:**
   ```bash
   cp deploy.sh.template deploy.sh
   chmod +x deploy.sh
   ```

4. **Deploy securely:**
   ```bash
   ./deploy.sh apps
   ```

### Environment Variable Usage

**For local testing:**
```bash
export TEST_USERNAME="your_test_user"
export TEST_PASSWORD="your_test_password"
./test-dual-auth.sh
```

**For CI/CD pipelines:**
```yaml
# GitHub Actions example
env:
  DEPLOY_USERNAME: ${{ secrets.DEPLOY_USERNAME }}
  DEPLOY_PASSWORD: ${{ secrets.DEPLOY_PASSWORD }}
```

## 🔒 Password Security

### Password Requirements
- **Minimum 12 characters**
- **Mix of uppercase, lowercase, numbers, and symbols**
- **Unique per environment** (dev, staging, production)
- **No dictionary words or personal information**

### Password Generation
```bash
# Generate a secure password
openssl rand -base64 32

# Or use a password manager like:
# - 1Password
# - Bitwarden  
# - LastPass
```

## 🌐 Environment-Specific Configuration

### Development Environment
```bash
# deploy-config.env (local only)
DEPLOY_USERNAME=dev_user
DEPLOY_PASSWORD=secure_dev_password_123!
DEPLOY_URL_1=http://localhost:8091/api/v1/apps
```

### Production Environment
```bash
# deploy-config.env (production server only)
DEPLOY_USERNAME=prod_user
DEPLOY_PASSWORD=very_secure_prod_password_456@
DEPLOY_URL_1=https://production-server.com/api/v1/apps
```

## 🔍 Security Checklist

### Before Committing Code
- [ ] No hardcoded credentials in any files
- [ ] All sensitive files are in `.gitignore`
- [ ] Template files use placeholder values only
- [ ] Documentation doesn't contain real credentials
- [ ] Test scripts use environment variables or defaults

### Before Deploying
- [ ] Updated `deploy-config.env` with current credentials
- [ ] Verified credentials work in target environment
- [ ] Used HTTPS endpoints where possible
- [ ] Tested deployment in non-production first

### Regular Maintenance
- [ ] Rotate credentials quarterly
- [ ] Review and update `.gitignore` as needed
- [ ] Audit code for accidentally committed secrets
- [ ] Update team members on security practices

## 🚨 Incident Response

### If Credentials Are Accidentally Committed:

1. **Immediate Actions:**
   ```bash
   # Remove from current commit
   git reset --soft HEAD~1
   git reset HEAD <file_with_credentials>
   
   # Add to .gitignore if not already there
   echo "file_with_credentials" >> .gitignore
   
   # Commit the fix
   git add .gitignore
   git commit -m "Add sensitive file to .gitignore"
   ```

2. **Change Credentials:**
   - Immediately change any exposed credentials
   - Update all environments with new credentials
   - Notify team members of the incident

3. **Clean Git History (if necessary):**
   ```bash
   # For recent commits
   git rebase -i HEAD~<number_of_commits>
   
   # For complete history cleanup (use with caution)
   git filter-branch --force --index-filter \
     'git rm --cached --ignore-unmatch <file>' \
     --prune-empty --tag-name-filter cat -- --all
   ```

## 🎯 Authentication Best Practices

### JWT Tokens
- Use strong signing keys (minimum 256 bits)
- Set appropriate expiration times (24 hours recommended)
- Store signing keys in environment variables
- Implement token refresh mechanisms for long sessions

### Basic Authentication
- Only use over HTTPS in production
- Implement rate limiting to prevent brute force attacks
- Use strong passwords with sufficient entropy
- Consider IP whitelisting for API access

### Database Security
- Use encrypted password storage (BCrypt)
- Implement account lockout policies
- Log authentication attempts
- Regular security audits

## 📚 Additional Resources

### Security Tools
- **Secret Scanning:** GitHub Advanced Security, GitLab Secret Detection
- **Password Managers:** 1Password, Bitwarden, LastPass
- **Environment Management:** dotenv, Vault, AWS Secrets Manager
- **Security Testing:** OWASP ZAP, Burp Suite, SonarQube

### Documentation
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [JWT Security Best Practices](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-jwt-bcp)

## 📞 Support

If you discover security vulnerabilities or have questions about secure practices:

1. **Internal Team:** Contact the development team lead
2. **Security Issues:** Report through secure channels only
3. **Documentation:** Update this guide with new best practices

Remember: **Security is everyone's responsibility!** 🛡️