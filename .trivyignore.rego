# Ignore all findings for this OS package in the Keycloak image. Not vulnerable.
# See: UID2-8240, UID2-8241
package trivy

import rego.v1

default ignore := false

ignore if {
	input.PkgName == "sqlite-libs"
	startswith(input.PkgIdentifier.PURL, "pkg:rpm/")
}
